import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { User, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [gridLines, setGridLines] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);

  const renderUserSection = () => (
    <View style={styles.userSection}>
      <View style={styles.avatarContainer}>
        <User size={40} color={Colors.textSecondary} />
      </View>
      
      <Text style={styles.userName}>Danny Breckenridge</Text>
      <Text style={styles.userEmail}>danny@email.com</Text>
      <Text style={styles.memberSince}>Member since Jan 2025</Text>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>12 DOODLES CREATED</Text>
      </View>
    </View>
  );

  const renderPreferencesSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>APP PREFERENCES</Text>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingTitle}>Dark mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: Colors.gray600, true: Colors.primary }}
          thumbColor={Colors.white}
        />
      </View>
      
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingTitle}>Auto-save interval</Text>
        <ChevronRight size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingTitle}>Grid lines</Text>
        <Switch
          value={gridLines}
          onValueChange={setGridLines}
          trackColor={{ false: Colors.gray600, true: Colors.primary }}
          thumbColor={Colors.white}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingTitle}>Haptic feedback</Text>
        <Switch
          value={hapticFeedback}
          onValueChange={setHapticFeedback}
          trackColor={{ false: Colors.gray600, true: Colors.primary }}
          thumbColor={Colors.white}
        />
      </View>
    </View>
  );

  const renderAccountSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ACCOUNT</Text>
      
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingTitle}>Change password</Text>
        <ChevronRight size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingTitle}>Email notifications</Text>
        <Switch
          value={emailNotifications}
          onValueChange={setEmailNotifications}
          trackColor={{ false: Colors.gray600, true: Colors.primary }}
          thumbColor={Colors.white}
        />
      </View>
      
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingTitle}>Export data</Text>
        <ChevronRight size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.settingItem}>
        <Text style={[styles.settingTitle, styles.deleteText]}>Delete account</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSignOutButton = () => (
    <TouchableOpacity style={styles.signOutButton}>
      <Text style={styles.signOutText}>Sign Out</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderUserSection()}
        {renderPreferencesSection()}
        {renderAccountSection()}
        {renderSignOutButton()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  userSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderRadius: 20,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  settingTitle: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  deleteText: {
    color: Colors.accent,
  },
  signOutButton: {
    marginHorizontal: 24,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.accent,
  },
});