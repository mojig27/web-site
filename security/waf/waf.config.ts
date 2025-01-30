export const wafConfig = {
    // Rate Limiting
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests, please try again later.'
    },
  
    // IP Whitelist/Blacklist
    ipFilter: {
      whitelist: ['127.0.0.1'], // Trusted IPs
      blacklist: [], // Blocked IPs
    },
  
    // SQL Injection Protection
    sqlInjection: {
      enabled: true,
      patterns: [
        /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
        /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
        /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
        /((\%27)|(\'))union/i
      ]
    },
  
    // XSS Protection
    xss: {
      enabled: true,
      patterns: [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /onerror=/gi,
        /onload=/gi,
        /onclick=/gi
      ]
    },
  
    // File Upload Protection
    fileUpload: {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      scanForMalware: true
    },
  
    // Request Sanitization
    sanitization: {
      enabled: true,
      fields: ['body', 'query', 'params']
    }
  };