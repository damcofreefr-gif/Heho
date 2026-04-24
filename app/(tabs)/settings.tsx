import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type ExtraConfig = {
  publicAppUrl?: string;
};

function getConfiguredUrl() {
  const extra = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;

  if (extra.publicAppUrl) {
    return extra.publicAppUrl;
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.location.href;
  }

  return Linking.createURL('/');
}

function isLocalUrl(url: string) {
  return (
    url.includes('localhost') ||
    url.includes('127.0.0.1') ||
    url.includes('192.168.') ||
    url.includes('10.0.')
  );
}

export default function SettingsScreen() {
  const [shareUrl, setShareUrl] = useState('');
  const [qrCodeUri, setQrCodeUri] = useState('');

  useEffect(() => {
    const nextUrl = getConfiguredUrl();
    setShareUrl(nextUrl);

    QRCode.toDataURL(nextUrl, {
      margin: 1,
      width: 280,
      color: {
        dark: '#111827',
        light: '#ffffff',
      },
    })
      .then(setQrCodeUri)
      .catch((error: unknown) => {
        console.error(error);
      });
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Installe Heho depuis ce lien : ${shareUrl}`,
        url: shareUrl,
      });
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const localUrl = shareUrl ? isLocalUrl(shareUrl) : false;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.title}>Parametres</Text>
        <Text style={styles.subtitle}>
          Cette page explique comment installer et partager Heho simplement.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Partager avec un QR code</Text>
        <Text style={styles.cardText}>
          Scanne ce QR code pour ouvrir directement la page web de l&apos;appli.
        </Text>

        {qrCodeUri ? (
          <Image source={{ uri: qrCodeUri }} style={styles.qrCode} />
        ) : (
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrPlaceholderText}>Generation du QR code...</Text>
          </View>
        )}

        <Text selectable style={styles.url}>
          {shareUrl}
        </Text>

        {localUrl && (
          <Text style={styles.warning}>
            Cette URL est locale. Pour la partager a d&apos;autres utilisateurs, publie l&apos;appli
            sur une URL publique puis renseigne `expo.extra.publicAppUrl` dans `app.json`.
          </Text>
        )}

        <Pressable style={styles.primaryButton} onPress={handleShare}>
          <Text style={styles.primaryButtonText}>Partager le lien</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Installer sur le telephone</Text>
        <Text style={styles.step}>1. Ouvre le lien ou scanne le QR code sur ton mobile.</Text>
        <Text style={styles.step}>2. Sur Android Chrome, ouvre le menu puis "Ajouter a l&apos;ecran d&apos;accueil".</Text>
        <Text style={styles.step}>3. Sur iPhone Safari, touche Partager puis "Sur l&apos;ecran d&apos;accueil".</Text>
        <Text style={styles.step}>4. L&apos;appli s&apos;ouvrira ensuite comme une mini appli depuis l&apos;icone.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Comment partager l&apos;appli</Text>
        <Text style={styles.step}>1. Publie la version web sur une URL publique.</Text>
        <Text style={styles.step}>2. Remplis `publicAppUrl` dans `app.json` pour fixer le bon lien de partage.</Text>
        <Text style={styles.step}>3. Donne soit le lien, soit cette page Parametres avec son QR code.</Text>
        <Text style={styles.step}>4. Les utilisateurs peuvent ensuite l&apos;installer depuis leur navigateur.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  hero: {
    gap: 8,
    paddingTop: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#334155',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    gap: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  cardText: {
    fontSize: 15,
    lineHeight: 21,
    color: '#475569',
  },
  qrCode: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    borderRadius: 16,
  },
  qrPlaceholder: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  qrPlaceholderText: {
    textAlign: 'center',
    color: '#475569',
    fontWeight: '600',
  },
  url: {
    fontSize: 13,
    lineHeight: 18,
    color: '#2563eb',
  },
  warning: {
    fontSize: 14,
    lineHeight: 20,
    color: '#b45309',
    backgroundColor: '#fffbeb',
    borderRadius: 14,
    padding: 12,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
  },
  step: {
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
  },
});
