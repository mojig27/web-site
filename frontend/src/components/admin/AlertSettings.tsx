import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Switch } from '@headlessui/react';
import { toast } from 'react-toastify';

interface AlertSettingsForm {
  thresholds: {
    metric: string;
    warning: number;
    critical: number;
    enabled: boolean;
  }[];
  notificationChannels: {
    type: string;
    config: {
      destination: string;
      enabled: boolean;
    };
  }[];
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
}

export const AlertSettings: React.FC = () => {
  const { control, handleSubmit, watch, reset } = useForm<AlertSettingsForm>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/alert-settings');
      const data = await response.json();
      if (data.success) {
        reset(data.settings);
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AlertSettingsForm) => {
    try {
      setSaving(true);
      const response = await fetch('/api/alert-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Settings saved successfully');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const testNotification = async (channelType: string) => {
    try {
      const response = await fetch(`/api/alert-settings/test/${channelType}`, {
        method: 'POST'
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Test notification sent successfully');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('Failed to send test notification');
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Thresholds Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Performance Thresholds</h2>
        <div className="grid gap-6">
          {watch('thresholds')?.map((_, index) => (
            <Controller
              key={index}
              control={control}
              name={`thresholds.${index}`}
              render={({ field }) => (
                <div className="grid grid-cols-4 gap-4 items-center">
                  <input
                    type="text"
                    {...field}
                    name={`thresholds.${index}.metric`}
                    className="input"
                    placeholder="Metric name"
                  />
                  <input
                    type="number"
                    {...field}
                    name={`thresholds.${index}.warning`}
                    className="input"
                    placeholder="Warning threshold"
                  />
                  <input
                    type="number"
                    {...field}
                    name={`thresholds.${index}.critical`}
                    className="input"
                    placeholder="Critical threshold"
                  />
                  <Switch
                    checked={field.value.enabled}
                    onChange={(checked) => field.onChange({ ...field.value, enabled: checked })}
                    className={`${
                      field.value.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Enable threshold</span>
                    <span
                      className={`${
                        field.value.enabled ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>
              )}
            />
          ))}
        </div>
      </div>

      {/* Notification Channels Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Notification Channels</h2>
        <div className="grid gap-6">
          {watch('notificationChannels')?.map((_, index) => (
            <Controller
              key={index}
              control={control}
              name={`notificationChannels.${index}`}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-4 items-center">
                  <select
                    {...field}
                    name={`notificationChannels.${index}.type`}
                    className="select"
                  >
                    <option value="email">Email</option>
                    <option value="slack">Slack</option>
                    <option value="webhook">Webhook</option>
                  </select>
                  <input
                    type="text"
                    {...field}
                    name={`notificationChannels.${index}.config.destination`}
                    className="input"
                    placeholder="Destination"
                  />
                  <button
                    type="button"
                    onClick={() => testNotification(field.value.type)}
                    className="btn btn-secondary"
                  >
                    Test
                  </button>
                </div>
              )}
            />
          ))}
        </div>
      </div>

      {/* Quiet Hours Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quiet Hours</h2>
        <Controller
          control={control}
          name="quietHours"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Switch
                  checked={field.value.enabled}
                  onChange={(checked) => field.onChange({ ...field.value, enabled: checked })}
                  className={`${
                    field.value.enabled ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">Enable quiet hours</span>
                  <span
                    className={`${
                      field.value.enabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>
              <input
                type="time"
                {...field}
                name="quietHours.start"
                className="input"
                disabled={!field.value.enabled}
              />
              <input
                type="time"
                {...field}
                name="quietHours.end"
                className="input"
                disabled={!field.value.enabled}
              />
              <select
                {...field}
                name="quietHours.timezone"
                className="select col-span-2"
                disabled={!field.value.enabled}
              >
                {Intl.supportedValuesOf('timeZone').map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          )}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
};