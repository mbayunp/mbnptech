import express from 'express';
import cors from 'cors';
import path from 'path';
import { errorHandler } from './shared/errorHandler';
import { helmetMiddleware, apiLimiter, authLimiter, xssSanitizer } from './shared/security';
import authRoutes from './modules/auth/auth.routes';
import invitationsRoutes from './modules/invitations/invitations.routes';
import rsvpRoutes from './modules/rsvp/rsvp.routes';
import guestsRoutes from './modules/guests/guests.routes';
import uploadsRoutes from './modules/uploads/uploads.routes';
import paymentRoutes from './modules/payment/payment.routes';

// Patch BigInt serialization for JSON responses
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const app = express();

// Apply security headers
app.use(helmetMiddleware);

// Dynamic CORS options to allow subdomains (localhost:3000 and production domain)
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    
    const isLocalhost = origin.startsWith('http://localhost:') || origin.includes('.localhost:');
    const isProductionDomain = origin === 'https://mbnp.my.id' || origin.endsWith('.mbnp.my.id');
    
    if (isLocalhost || isProductionDomain) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize inputs for XSS
app.use(xssSanitizer);

// Apply general API Rate Limiting
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

// Serve static uploads
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/invitations', invitationsRoutes);
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/guests', guestsRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/payment', paymentRoutes);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: `Cannot find ${req.method} ${req.url} on this server.`,
  });
});

// Error handling middleware
app.use(errorHandler as any);

export default app;
