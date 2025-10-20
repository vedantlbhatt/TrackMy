# Web Platform Setup Guide

This guide will help you set up the web version of TrackMy that shares the same backend and database as your mobile app.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Web App       │    │   Backend API   │
│   (React Native)│    │   (Next.js)     │    │   (FastAPI)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    └─────────────────┘
```

## 🚀 **Quick Start**

### 1. **Install Dependencies**

```bash
cd web-app
npm install
```

### 2. **Environment Setup**

Create a `.env.local` file in the `web-app` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Google Maps Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. **Start Development Server**

```bash
npm run dev
```

The web app will be available at `http://localhost:3000`

## 🔧 **Configuration**

### **Backend API**
- **URL**: Set `NEXT_PUBLIC_API_URL` to your backend URL
- **CORS**: Ensure your FastAPI backend allows requests from the web app
- **Authentication**: Web app uses the same API endpoints as mobile

### **Google Maps**
1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Add your domain to allowed origins
4. Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### **Stripe Payments**
1. Get publishable key from [Stripe Dashboard](https://dashboard.stripe.com/)
2. Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Ensure backend has secret key configured

## 📱 **Features Implemented**

### **Core Features**
- ✅ **Interactive Map**: Google Maps with custom markers
- ✅ **Report List**: Browse all lost items
- ✅ **Create Reports**: Full form with location, bounty, images
- ✅ **Payment Integration**: Stripe for bounty payments
- ✅ **Bounty Claims**: Submit and manage claims
- ✅ **Responsive Design**: Works on desktop and mobile

### **Web-Specific Features**
- ✅ **SEO Optimized**: Next.js with server-side rendering
- ✅ **Fast Loading**: Optimized images and code splitting
- ✅ **Progressive Web App**: Can be installed on devices
- ✅ **Search Engine Friendly**: Better discoverability

## 🎨 **UI/UX Features**

### **Design System**
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Consistent iconography
- **Responsive Grid**: Adapts to all screen sizes
- **Dark/Light Mode**: Automatic theme detection

### **User Experience**
- **Real-time Updates**: Live data from backend
- **Smooth Animations**: CSS transitions and loading states
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant components

## 🚀 **Deployment Options**

### **Option 1: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd web-app
vercel

# Set environment variables in Vercel dashboard
```

### **Option 2: Netlify**
```bash
# Build the app
npm run build

# Deploy to Netlify
# Upload dist folder or connect GitHub repo
```

### **Option 3: AWS/Google Cloud**
```bash
# Build for production
npm run build

# Deploy to your preferred cloud provider
```

## 🔄 **Shared Backend Integration**

### **API Endpoints Used**
- `GET /getAllLostReports/` - Fetch all reports
- `POST /createLostReport/` - Create new report
- `POST /create-payment-intent` - Process payments
- `POST /create-bounty-claim` - Submit bounty claims
- `GET /profile/` - User authentication

### **Database Schema**
Both mobile and web apps use the same database tables:
- `lost_reports` - Lost item reports
- `found_reports` - Found item reports
- `payment_transactions` - Payment records
- `bounty_claims` - Bounty claim submissions

## 🔐 **Security Considerations**

### **Frontend Security**
- **Environment Variables**: Never expose secrets
- **Input Validation**: Client-side validation
- **HTTPS Only**: Secure connections required
- **CORS Configuration**: Proper origin restrictions

### **Backend Security**
- **API Authentication**: Same as mobile app
- **Rate Limiting**: Prevent abuse
- **Input Sanitization**: Server-side validation
- **Payment Security**: PCI compliance via Stripe

## 📊 **Performance Optimization**

### **Next.js Optimizations**
- **Image Optimization**: Automatic WebP conversion
- **Code Splitting**: Lazy loading components
- **Caching**: Static generation where possible
- **Bundle Analysis**: Monitor bundle size

### **Database Optimization**
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Indexed database queries
- **Caching**: Redis for frequently accessed data

## 🧪 **Testing**

### **Unit Tests**
```bash
npm run test
```

### **Integration Tests**
```bash
npm run test:integration
```

### **E2E Tests**
```bash
npm run test:e2e
```

## 📈 **Analytics & Monitoring**

### **Performance Monitoring**
- **Vercel Analytics**: Built-in performance metrics
- **Google Analytics**: User behavior tracking
- **Error Tracking**: Sentry integration

### **Business Metrics**
- **Report Creation**: Track lost item reports
- **Bounty Payments**: Monitor payment volume
- **User Engagement**: Time on site, interactions

## 🔄 **Mobile-Web Sync**

### **Real-time Updates**
- **WebSocket**: Live updates for new reports
- **Polling**: Periodic data refresh
- **Push Notifications**: Browser notifications

### **Cross-Platform Features**
- **Shared Authentication**: Same user accounts
- **Unified Database**: Single source of truth
- **Consistent API**: Same endpoints for both platforms

## 🚀 **Production Checklist**

### **Before Launch**
- [ ] Environment variables configured
- [ ] Google Maps API key set
- [ ] Stripe keys configured
- [ ] Backend CORS configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] Analytics tracking setup

### **Post-Launch**
- [ ] Monitor error rates
- [ ] Track user engagement
- [ ] Monitor payment success rates
- [ ] Review performance metrics
- [ ] Update dependencies regularly

## 🆘 **Troubleshooting**

### **Common Issues**
1. **Maps not loading**: Check Google Maps API key
2. **Payments failing**: Verify Stripe configuration
3. **API errors**: Check backend CORS settings
4. **Build failures**: Clear cache and reinstall dependencies

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 📞 **Support**

For issues with:
- **Next.js**: Check [Next.js documentation](https://nextjs.org/docs)
- **Google Maps**: Check [Maps JavaScript API docs](https://developers.google.com/maps/documentation/javascript)
- **Stripe**: Check [Stripe documentation](https://stripe.com/docs)
- **Backend**: Check FastAPI and database logs

## 💰 **Cost Structure**

### **Hosting Costs**
- **Vercel**: Free tier available, $20/month for pro
- **Netlify**: Free tier available, $19/month for pro
- **AWS**: Pay-as-you-go, ~$10-50/month

### **API Costs**
- **Google Maps**: $7 per 1000 requests
- **Stripe**: 2.9% + $0.30 per transaction
- **Database**: Depends on usage and provider

The web platform is now ready to complement your mobile app with the same powerful features and shared backend!
