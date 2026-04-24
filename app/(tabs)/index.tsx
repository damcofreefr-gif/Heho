import * as Notifications from 'expo-notifications';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const themes = [
  {
    name: 'blue',
    screen: '#f3f4f6',
    card: '#ffffff',
    text: '#111827',
    secondaryButton: '#e5e7eb',
    secondaryButtonText: '#111827',
    primaryButton: '#2563eb',
    primaryButtonText: '#ffffff',
    badgeBg: '#dbeafe',
    badgeText: '#1d4ed8',
    paletteBg: '#eef2ff',
    activeBg: '#dcfce7',
    activeText: '#166534',
    activeDot: '#16a34a',
  },
  {
    name: 'green',
    screen: '#ecfdf5',
    card: '#ffffff',
    text: '#14532d',
    secondaryButton: '#dcfce7',
    secondaryButtonText: '#14532d',
    primaryButton: '#16a34a',
    primaryButtonText: '#ffffff',
    badgeBg: '#bbf7d0',
    badgeText: '#166534',
    paletteBg: '#d1fae5',
    activeBg: '#dcfce7',
    activeText: '#166534',
    activeDot: '#16a34a',
  },
  {
    name: 'purple',
    screen: '#faf5ff',
    card: '#ffffff',
    text: '#581c87',
    secondaryButton: '#f3e8ff',
    secondaryButtonText: '#581c87',
    primaryButton: '#9333ea',
    primaryButtonText: '#ffffff',
    badgeBg: '#e9d5ff',
    badgeText: '#7e22ce',
    paletteBg: '#f5e8ff',
    activeBg: '#ede9fe',
    activeText: '#6d28d9',
    activeDot: '#8b5cf6',
  },
  {
    name: 'dark',
    screen: '#111827',
    card: '#1f2937',
    text: '#f9fafb',
    secondaryButton: '#374151',
    secondaryButtonText: '#f9fafb',
    primaryButton: '#3b82f6',
    primaryButtonText: '#ffffff',
    badgeBg: '#1e3a8a',
    badgeText: '#dbeafe',
    paletteBg: '#374151',
    activeBg: '#064e3b',
    activeText: '#d1fae5',
    activeDot: '#34d399',
  },
  {
    name: 'sunset',
    screen: '#fff7ed',
    card: '#ffffff',
    text: '#7c2d12',
    secondaryButton: '#ffedd5',
    secondaryButtonText: '#9a3412',
    primaryButton: '#f97316',
    primaryButtonText: '#ffffff',
    badgeBg: '#fed7aa',
    badgeText: '#c2410c',
    paletteBg: '#ffedd5',
    activeBg: '#ffedd5',
    activeText: '#9a3412',
    activeDot: '#ea580c',
  },
  {
    name: 'rose',
    screen: '#fff1f2',
    card: '#ffffff',
    text: '#881337',
    secondaryButton: '#ffe4e6',
    secondaryButtonText: '#9f1239',
    primaryButton: '#e11d48',
    primaryButtonText: '#ffffff',
    badgeBg: '#fecdd3',
    badgeText: '#be123c',
    paletteBg: '#ffe4e6',
    activeBg: '#ffe4e6',
    activeText: '#9f1239',
    activeDot: '#e11d48',
  },
  {
    name: 'sand',
    screen: '#f8f5f0',
    card: '#fffdf8',
    text: '#44403c',
    secondaryButton: '#f5f5f4',
    secondaryButtonText: '#44403c',
    primaryButton: '#78716c',
    primaryButtonText: '#ffffff',
    badgeBg: '#e7e5e4',
    badgeText: '#57534e',
    paletteBg: '#f5f5f4',
    activeBg: '#ecfccb',
    activeText: '#3f6212',
    activeDot: '#65a30d',
  },
  {
    name: 'ocean',
    screen: '#ecfeff',
    card: '#ffffff',
    text: '#164e63',
    secondaryButton: '#cffafe',
    secondaryButtonText: '#155e75',
    primaryButton: '#0891b2',
    primaryButtonText: '#ffffff',
    badgeBg: '#a5f3fc',
    badgeText: '#0e7490',
    paletteBg: '#cffafe',
    activeBg: '#ccfbf1',
    activeText: '#115e59',
    activeDot: '#14b8a6',
  },
  {
    name: 'midnight',
    screen: '#0f172a',
    card: '#172033',
    text: '#e2e8f0',
    secondaryButton: '#273449',
    secondaryButtonText: '#e2e8f0',
    primaryButton: '#38bdf8',
    primaryButtonText: '#082f49',
    badgeBg: '#1d4ed8',
    badgeText: '#dbeafe',
    paletteBg: '#22304a',
    activeBg: '#0f3d2e',
    activeText: '#ccfbf1',
    activeDot: '#2dd4bf',
  },
];

export default function HomeScreen() {
  const [now, setNow] = useState(new Date());
  const [offsetMinutes, setOffsetMinutes] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);
  const [reminderActive, setReminderActive] = useState(false);
  const [reminderLabel, setReminderLabel] = useState('');

  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const theme = themes[themeIndex];

  useEffect(() => {
    requestNotificationPermission();

    clockIntervalRef.current = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
      if (clockIntervalRef.current) {
        clearInterval(clockIntervalRef.current);
      }
    };
  }, []);

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'web') {
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    if (status !== 'granted') {
      Alert.alert(
        'Permission refusee',
        'Active les notifications pour recevoir un rappel.'
      );
    }
  };

  const startResetTimer = () => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = setTimeout(() => {
      setOffsetMinutes(0);
    }, 4000);
  };

  const addOneHour = () => {
    setOffsetMinutes((prev) => prev + 60);
    startResetTimer();
  };

  const addFiveMinutes = () => {
    setOffsetMinutes((prev) => prev + 5);
    startResetTimer();
  };

  const cycleTheme = () => {
    setThemeIndex((prev) => (prev + 1) % themes.length);
  };

  const displayedDate = useMemo(() => {
    const updated = new Date(now);
    updated.setMinutes(updated.getMinutes() + offsetMinutes);
    return updated;
  }, [now, offsetMinutes]);

  const formatTwoDigits = (value: number) => value.toString().padStart(2, '0');

  const displayedTime = `${formatTwoDigits(displayedDate.getHours())}:${formatTwoDigits(
    displayedDate.getMinutes()
  )}`;

  const formatOffsetLabel = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `+${hours} h ${minutes} min`;
    }

    if (hours > 0) {
      return `+${hours} h`;
    }

    return `+${minutes} min`;
  };

  const deactivateReminder = async () => {
    setReminderActive(false);
    setReminderLabel('');

    if (Platform.OS === 'web') {
      Alert.alert('Rappel desactive', "L'indicateur actif a ete retire.");
      return;
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      Alert.alert('Rappel desactive', 'Le rappel actif a ete annule.');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de desactiver le rappel.');
      console.error(error);
    }
  };

  const scheduleReminder = async (repeatDaily: boolean) => {
    if (Platform.OS === 'web') {
      setReminderActive(true);
      setReminderLabel(
        repeatDaily
          ? `Actif - tous les jours a ${formatTwoDigits(displayedDate.getHours())}:${formatTwoDigits(displayedDate.getMinutes())}`
          : `Actif - ${formatTwoDigits(displayedDate.getHours())}:${formatTwoDigits(displayedDate.getMinutes())}`
      );

      Alert.alert(
        'Web non supporte',
        'La programmation reelle des notifications ne fonctionne pas dans le navigateur. Le visuel actif a ete simule.'
      );
      return;
    }

    const { status } = await Notifications.getPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Erreur', "La permission de notification n'a pas ete accordee.");
      return;
    }

    try {
      if (repeatDaily) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Heho !',
            body: `Rappel quotidien a ${formatTwoDigits(
              displayedDate.getHours()
            )}:${formatTwoDigits(displayedDate.getMinutes())}`,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: displayedDate.getHours(),
            minute: displayedDate.getMinutes(),
          },
        });

        setReminderActive(true);
        setReminderLabel(
          `Actif - tous les jours a ${formatTwoDigits(
            displayedDate.getHours()
          )}:${formatTwoDigits(displayedDate.getMinutes())}`
        );

        Alert.alert(
          'Rappel quotidien programme',
          `Tous les jours a ${formatTwoDigits(
            displayedDate.getHours()
          )}:${formatTwoDigits(displayedDate.getMinutes())}`
        );
      } else {
        const triggerDate = new Date(now);
        triggerDate.setMinutes(triggerDate.getMinutes() + offsetMinutes);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Heho !',
            body: `Rappel prevu a ${formatTwoDigits(
              triggerDate.getHours()
            )}:${formatTwoDigits(triggerDate.getMinutes())}`,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
          },
        });

        setReminderActive(true);
        setReminderLabel(
          `Actif - ${formatTwoDigits(triggerDate.getHours())}:${formatTwoDigits(
            triggerDate.getMinutes()
          )}`
        );

        Alert.alert(
          'Rappel programme',
          `Un rappel est prevu le ${triggerDate.toLocaleDateString()} a ${formatTwoDigits(
            triggerDate.getHours()
          )}:${formatTwoDigits(triggerDate.getMinutes())}`
        );
      }

      setOffsetMinutes(0);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de programmer la notification.');
      console.error(error);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.screen }]}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Pressable
          style={[styles.paletteButton, { backgroundColor: theme.paletteBg }]}
          onPress={cycleTheme}
        >
          <Text style={styles.paletteIcon}>Couleurs</Text>
        </Pressable>

        <Text style={[styles.title, { color: theme.text }]}>Heho !</Text>

        <View style={styles.timeRow}>
          <Text style={[styles.time, { color: theme.text }]}>{displayedTime}</Text>

          {offsetMinutes > 0 && (
            <View style={[styles.offsetBadge, { backgroundColor: theme.badgeBg }]}>
              <Text style={[styles.offsetBadgeText, { color: theme.badgeText }]}>
                {formatOffsetLabel(offsetMinutes)}
              </Text>
            </View>
          )}
        </View>

        {reminderActive && (
          <View style={styles.activeSection}>
            <Pressable
              onLongPress={deactivateReminder}
              delayLongPress={450}
              style={[styles.activeBadge, { backgroundColor: theme.activeBg }]}
            >
              <View style={[styles.activeDot, { backgroundColor: theme.activeDot }]} />
              <View style={styles.activeTextGroup}>
                <Text style={[styles.activeBadgeText, { color: theme.activeText }]}>
                  {reminderLabel}
                </Text>
                <Text style={[styles.activeBadgeHint, { color: theme.activeText }]}>
                  Appui long ici pour désactiver
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        <View style={styles.buttonsColumn}>
          <Pressable
            style={[styles.secondaryButton, { backgroundColor: theme.secondaryButton }]}
            onPress={addOneHour}
          >
            <Text
              style={[
                styles.secondaryButtonText,
                { color: theme.secondaryButtonText },
              ]}
            >
              +1 heure
            </Text>
          </Pressable>

          <Pressable
            style={[styles.secondaryButton, { backgroundColor: theme.secondaryButton }]}
            onPress={addFiveMinutes}
          >
            <Text
              style={[
                styles.secondaryButtonText,
                { color: theme.secondaryButtonText },
              ]}
            >
              +5 min
            </Text>
          </Pressable>

          <View style={styles.programArea}>
            <Pressable
              style={[styles.primaryButton, { backgroundColor: theme.primaryButton }]}
              onPress={() => scheduleReminder(false)}
              onLongPress={() => scheduleReminder(true)}
              delayLongPress={450}
            >
              <Text style={[styles.primaryButtonText, { color: theme.primaryButtonText }]}>
                Programmer
              </Text>
              <Text
                style={[styles.primaryButtonHint, { color: theme.primaryButtonText }]}
              >
                Appui long = rappel quotidien
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '100%',
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'stretch',
    position: 'relative',
    gap: 16,
  },
  paletteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    minWidth: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 10,
  },
  paletteIcon: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  time: {
    fontSize: 72,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 2,
  },
  offsetBadge: {
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  offsetBadgeText: {
    fontSize: 20,
    fontWeight: '800',
  },
  activeSection: {
    alignItems: 'center',
  },
  activeBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  activeTextGroup: {
    flexShrink: 1,
    gap: 2,
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  activeBadgeText: {
    fontSize: 18,
    fontWeight: '800',
  },
  activeBadgeHint: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.85,
  },
  buttonsColumn: {
    gap: 14,
  },
  secondaryButton: {
    borderRadius: 24,
    minHeight: 82,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    fontSize: 28,
    fontWeight: '800',
  },
  programArea: {
    position: 'relative',
  },
  primaryButton: {
    borderRadius: 24,
    minHeight: 104,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  primaryButtonHint: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    opacity: 0.9,
  },
});
