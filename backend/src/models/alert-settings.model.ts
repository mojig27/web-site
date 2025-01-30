import mongoose, { Document, Schema } from 'mongoose';

interface IAlertThreshold {
  metric: string;
  warning: number;
  critical: number;
  enabled: boolean;
}

interface INotificationChannel {
  type: 'email' | 'slack' | 'webhook';
  config: {
    destination: string;
    enabled: boolean;
  };
}

export interface IAlertSettings extends Document {
  userId: string;
  thresholds: IAlertThreshold[];
  notificationChannels: INotificationChannel[];
  quietHours: {
    enabled: boolean;
    start: string; // format: "HH:mm"
    end: string;   // format: "HH:mm"
    timezone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AlertSettingsSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  thresholds: [{
    metric: {
      type: String,
      required: true
    },
    warning: {
      type: Number,
      required: true
    },
    critical: {
      type: Number,
      required: true
    },
    enabled: {
      type: Boolean,
      default: true
    }
  }],
  notificationChannels: [{
    type: {
      type: String,
      enum: ['email', 'slack', 'webhook'],
      required: true
    },
    config: {
      destination: String,
      enabled: {
        type: Boolean,
        default: true
      }
    }
  }],
  quietHours: {
    enabled: {
      type: Boolean,
      default: false
    },
    start: String,
    end: String,
    timezone: String
  }
}, {
  timestamps: true
});

export const AlertSettings = mongoose.model<IAlertSettings>('AlertSettings', AlertSettingsSchema);