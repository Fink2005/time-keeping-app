/* eslint-disable no-console */
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

const CHECK_IN_OUT_TASK = 'AUTO_CHECKINOUT';

TaskManager.defineTask(CHECK_IN_OUT_TASK, async ({ data, error }) => {
  if (error) return;

  const { eventType, region } = data as {
    eventType: Location.GeofencingEventType;
    region: Location.LocationRegion;
  };

  if (eventType === Location.GeofencingEventType.Enter) {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Chấm công', body: `Bạn đã chấm công vào! ${region.identifier}` },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 2 },
    });
    console.log(`Bạn đã chấm công vào! ${region.identifier} - ${new Date().toLocaleString()}`);
  }
  if (eventType === Location.GeofencingEventType.Exit) {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Chấm công', body: `Bạn đã chấm công ra! ${region.identifier}` },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 2 },
    });
    console.log(`Bạn đã chấm công ra! ${region.identifier} - ${new Date().toLocaleString()}`);
  }
});
export { CHECK_IN_OUT_TASK };
