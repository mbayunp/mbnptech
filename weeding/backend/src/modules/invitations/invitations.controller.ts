import { Response, NextFunction } from 'express';
import prisma from '../../config/db';
import redis from '../../config/redis';
import { AppError } from '../../shared/errorHandler';
import { AuthRequest } from '../../shared/middlewares';
import { deleteImage } from '../uploads/cloudinary.service';

export const createInvitation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      subdomain,
      title,
      weddingDate,
      themeColor,
      welcomeText,
      address,
      mapUrl,
      musicUrl,
      coverImage,
      templateCode,
      galleries,
      stories,
      themeSettings,
      sections,
    } = req.body;

    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!subdomain || !title || !weddingDate || !templateCode || !welcomeText || !address) {
      return next(new AppError('Missing required fields', 400));
    }

    const cleanSubdomain = subdomain.toLowerCase().trim();

    // Check if subdomain is taken
    const existing = await prisma.invitation.findUnique({
      where: { subdomain: cleanSubdomain },
    });

    if (existing) {
      return next(new AppError('Subdomain is already taken', 409));
    }

    // Resolve templateCode to templateId
    const template = await prisma.template.findUnique({
      where: { slug: templateCode },
    });

    if (!template) {
      return next(new AppError('Template not found', 404));
    }

    // Create invitation, galleries, stories, theme settings, and sections in one operation
    const invitation = await prisma.invitation.create({
      data: {
        subdomain: cleanSubdomain,
        slug: cleanSubdomain,
        title,
        weddingDate: new Date(weddingDate),
        themeColor: themeColor || '#4f46e5',
        welcomeText,
        address,
        mapUrl,
        musicUrl,
        coverImage,
        userId: BigInt(req.user.id),
        templateId: template.id,
        galleries: galleries && Array.isArray(galleries) ? {
          create: galleries.map((g: any, index: number) => ({
            imageUrl: g.imageUrl,
            sortOrder: index,
          })),
        } : undefined,
        stories: stories && Array.isArray(stories) ? {
          create: stories.map((s: any) => ({
            date: new Date(s.date),
            title: s.title,
            content: s.content,
            imageUrl: s.imageUrl,
          })),
        } : undefined,
        themeSettings: {
          create: {
            primaryColor: themeSettings?.primaryColor || '#4f46e5',
            secondaryColor: themeSettings?.secondaryColor || '#ec4899',
            fontFamily: themeSettings?.fontFamily || 'sans',
            animationStyle: themeSettings?.animationStyle || 'fade',
            backgroundStyle: themeSettings?.backgroundStyle || 'solid',
          },
        },
        sections: {
          create: sections && Array.isArray(sections)
            ? sections.map((sec: any) => ({
                sectionName: sec.sectionName,
                isEnabled: sec.isEnabled !== undefined ? Boolean(sec.isEnabled) : true,
              }))
            : [
                { sectionName: 'hero', isEnabled: true },
                { sectionName: 'bride', isEnabled: true },
                { sectionName: 'gallery', isEnabled: true },
                { sectionName: 'countdown', isEnabled: true },
                { sectionName: 'story', isEnabled: true },
                { sectionName: 'gift', isEnabled: true },
                { sectionName: 'rsvp', isEnabled: true },
                { sectionName: 'maps', isEnabled: true },
                { sectionName: 'music', isEnabled: true },
              ],
        },
      },
      include: {
        galleries: true,
        stories: true,
        themeSettings: true,
        sections: true,
      },
    });

    res.status(201).json({
      status: 'success',
      data: { invitation },
    });
  } catch (error) {
    next(error);
  }
};

export const getInvitationBySubdomain = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { subdomain } = req.params;
    const cleanSubdomain = subdomain.toLowerCase().trim();

    // 1. Try reading from Redis cache
    if (redis) {
      try {
        const cached = await redis.get(`subdomain:${cleanSubdomain}`);
        if (cached) {
          const parsedInvite = JSON.parse(cached);
          
          // Log analytics in background
          logAnalyticsAsync(BigInt(parsedInvite.id), req);

          return res.status(200).json({
            status: 'success',
            data: { invitation: parsedInvite },
          });
        }
      } catch (cacheErr) {
        console.error('[REDIS] Cache read failed:', cacheErr);
      }
    }

    // 2. Fallback to DB
    const invitation = await prisma.invitation.findUnique({
      where: { subdomain: cleanSubdomain },
      include: {
        galleries: { orderBy: { sortOrder: 'asc' } },
        stories: { orderBy: { date: 'asc' } },
        rsvps: { orderBy: { createdAt: 'desc' } },
        themeSettings: true,
        sections: true,
      },
    });

    if (!invitation) {
      return next(new AppError('Invitation not found', 404));
    }

    // 3. Write to Redis cache (1 hour expiry)
    if (redis) {
      try {
        await redis.setex(`subdomain:${cleanSubdomain}`, 3600, JSON.stringify(invitation));
      } catch (cacheErr) {
        console.error('[REDIS] Cache write failed:', cacheErr);
      }
    }

    // Track analytics (non-blocking)
    logAnalyticsAsync(invitation.id, req);

    res.status(200).json({
      status: 'success',
      data: { invitation },
    });
  } catch (error) {
    next(error);
  }
};

// Helper for asynchronous analytics logging
const logAnalyticsAsync = (invitationId: bigint, req: AuthRequest) => {
  const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString() || '';
  const userAgent = req.headers['user-agent'] || '';

  // Extract browser and device details
  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';

  let device = 'Desktop';
  if (/Mobile|Android|iPhone/i.test(userAgent)) device = 'Mobile';

  // Simulating country & city from headers (useful for Cloudflare/Vercel proxies)
  const country = req.headers['x-vercel-ip-country']?.toString() || 'Indonesia';
  const city = req.headers['x-vercel-ip-city']?.toString() || 'Jakarta';

  prisma.analytics.create({
    data: {
      invitationId,
      ipAddress,
      browser,
      device,
      country,
      city,
    },
  }).catch(err => console.error('Error logging analytics:', err));
};

export const getMyInvitations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const invitations = await prisma.invitation.findMany({
      where: { userId: BigInt(req.user.id) },
      orderBy: { createdAt: 'desc' },
      include: {
        themeSettings: true,
        sections: true,
        _count: {
          select: { rsvps: true, guests: true, analytics: true },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: { invitations },
    });
  } catch (error) {
    next(error);
  }
};

export const updateInvitation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      title,
      weddingDate,
      themeColor,
      welcomeText,
      address,
      mapUrl,
      musicUrl,
      coverImage,
      templateCode,
      isPublished,
      galleries,
      stories,
      themeSettings,
      sections,
    } = req.body;

    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: BigInt(id) },
    });

    if (!invitation) {
      return next(new AppError('Invitation not found', 404));
    }

    // Authorization check
    if (invitation.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('You do not have permission to update this invitation', 403));
    }

    // Delete old coverImage from storage if it changed
    if (coverImage !== undefined && coverImage !== invitation.coverImage && invitation.coverImage) {
      await deleteImage(invitation.coverImage);
    }

    // Delete old musicUrl from storage if it changed
    if (musicUrl !== undefined && musicUrl !== invitation.musicUrl && invitation.musicUrl) {
      await deleteImage(invitation.musicUrl);
    }

    // Resolve templateCode if provided
    let templateId: bigint | undefined = undefined;
    if (templateCode) {
      const template = await prisma.template.findUnique({
        where: { slug: templateCode },
      });
      if (!template) {
        return next(new AppError('Template not found', 404));
      }
      templateId = template.id;
    }

    // Perform transaction to update invitation metadata and clean/re-create galleries/stories if provided
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update basic info
      await tx.invitation.update({
        where: { id: BigInt(id) },
        data: {
          title,
          weddingDate: weddingDate ? new Date(weddingDate) : undefined,
          themeColor,
          welcomeText,
          address,
          mapUrl,
          musicUrl,
          coverImage,
          templateId,
          isPublished,
        },
      });

      // 2. Sync Theme Settings if provided
      if (themeSettings) {
        await tx.themeSettings.upsert({
          where: { invitationId: BigInt(id) },
          update: {
            primaryColor: themeSettings.primaryColor,
            secondaryColor: themeSettings.secondaryColor,
            fontFamily: themeSettings.fontFamily,
            animationStyle: themeSettings.animationStyle,
            backgroundStyle: themeSettings.backgroundStyle,
          },
          create: {
            invitationId: BigInt(id),
            primaryColor: themeSettings.primaryColor || '#4f46e5',
            secondaryColor: themeSettings.secondaryColor || '#ec4899',
            fontFamily: themeSettings.fontFamily || 'sans',
            animationStyle: themeSettings.animationStyle || 'fade',
            backgroundStyle: themeSettings.backgroundStyle || 'solid',
          },
        });
      }

      // 3. Sync Sections if provided
      if (sections && Array.isArray(sections)) {
        for (const sec of sections) {
          await tx.invitationSection.upsert({
            where: {
              invitationId_sectionName: {
                invitationId: BigInt(id),
                sectionName: sec.sectionName,
              },
            },
            update: {
              isEnabled: Boolean(sec.isEnabled),
            },
            create: {
              invitationId: BigInt(id),
              sectionName: sec.sectionName,
              isEnabled: Boolean(sec.isEnabled),
            },
          });
        }
      }

      // 4. Sync Galleries if provided
      if (galleries && Array.isArray(galleries)) {
        const oldGalleries = await tx.gallery.findMany({ where: { invitationId: BigInt(id) } });
        const newImageUrls = new Set(galleries.map((g: any) => g.imageUrl));
        
        // Delete removed gallery images from storage
        const deletedGalleries = oldGalleries.filter(og => og.imageUrl && !newImageUrls.has(og.imageUrl));
        for (const dg of deletedGalleries) {
          await deleteImage(dg.imageUrl);
        }

        await tx.gallery.deleteMany({ where: { invitationId: BigInt(id) } });
        if (galleries.length > 0) {
          await tx.gallery.createMany({
            data: galleries.map((g: any, idx: number) => ({
              invitationId: BigInt(id),
              imageUrl: g.imageUrl,
              sortOrder: idx,
            })),
          });
        }
      }

      // 5. Sync Stories if provided
      if (stories && Array.isArray(stories)) {
        const oldStories = await tx.story.findMany({ where: { invitationId: BigInt(id) } });
        const newStoryUrls = new Set(stories.map((s: any) => s.imageUrl).filter(Boolean));
        
        // Delete removed story images from storage
        const deletedStories = oldStories.filter(os => os.imageUrl && !newStoryUrls.has(os.imageUrl));
        for (const ds of deletedStories) {
          if (ds.imageUrl) await deleteImage(ds.imageUrl);
        }

        await tx.story.deleteMany({ where: { invitationId: BigInt(id) } });
        if (stories.length > 0) {
          await tx.story.createMany({
            data: stories.map((s: any) => ({
              invitationId: BigInt(id),
              date: new Date(s.date),
              title: s.title,
              content: s.content,
              imageUrl: s.imageUrl,
            })),
          });
        }
      }

      return tx.invitation.findUnique({
        where: { id: BigInt(id) },
        include: {
          galleries: { orderBy: { sortOrder: 'asc' } },
          stories: { orderBy: { date: 'asc' } },
          themeSettings: true,
          sections: true,
        },
      });
    });

    // Clear Redis Cache
    if (redis && updated) {
      await redis.del(`subdomain:${updated.subdomain}`);
    }

    res.status(200).json({
      status: 'success',
      data: { invitation: updated },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInvitation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: BigInt(id) },
    });

    if (!invitation) {
      return next(new AppError('Invitation not found', 404));
    }

    // Authorization check
    if (invitation.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('You do not have permission to delete this invitation', 403));
    }

    // Fetch related media files to clean up
    const relatedGalleries = await prisma.gallery.findMany({
      where: { invitationId: BigInt(id) }
    });
    const relatedStories = await prisma.story.findMany({
      where: { invitationId: BigInt(id) }
    });

    // Delete files from storage
    if (invitation.coverImage) {
      await deleteImage(invitation.coverImage);
    }
    if (invitation.musicUrl) {
      await deleteImage(invitation.musicUrl);
    }
    for (const g of relatedGalleries) {
      if (g.imageUrl) {
        await deleteImage(g.imageUrl);
      }
    }
    for (const s of relatedStories) {
      if (s.imageUrl) {
        await deleteImage(s.imageUrl);
      }
    }

    await prisma.invitation.delete({
      where: { id: BigInt(id) },
    });

    // Clear Redis Cache
    if (redis) {
      await redis.del(`subdomain:${invitation.subdomain}`);
    }

    res.status(200).json({
      status: 'success',
      message: 'Invitation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
