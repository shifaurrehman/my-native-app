import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { RegisteredUser } from '../types';

interface RegisteredUsersListProps {
  registeredUsers: RegisteredUser[];
  onClearDatabase: () => void;
  sectionNumber: number;
  theme: 'light' | 'dark';
}

export const RegisteredUsersList: React.FC<RegisteredUsersListProps> = ({
  registeredUsers,
  onClearDatabase,
  sectionNumber,
  theme,
}) => {
  const isDark = theme === 'dark';

  return (
    <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
      <Text style={[styles.sectionHeader, isDark && styles.sectionHeaderDark]}>
        {sectionNumber}. Registered Users (AsyncStorage)
      </Text>

      <View style={styles.databaseBox}>
        {registeredUsers.length === 0 ? (
          <Text style={styles.noUsersText}>No registered users in database.</Text>
        ) : (
          registeredUsers.map((user, idx) => (
            <View
              key={user.email}
              style={[
                styles.userItemRow,
                idx === registeredUsers.length - 1 && styles.noBorder,
              ]}
            >
              <Text style={styles.userItemName}>{user.name}</Text>
              <Text style={styles.userItemEmail}>{user.email}</Text>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.buttonSmall,
          isDark ? styles.buttonSmallRedDark : styles.buttonSmallRed,
        ]}
        onPress={onClearDatabase}
      >
        <Text style={[styles.buttonSmallText, isDark && styles.buttonSmallTextDark]}>
          Clear Registered Users Database
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionCardDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 6,
  },
  sectionHeaderDark: {
    color: '#F9FAFB',
    borderBottomColor: '#374151',
  },
  databaseBox: {
    backgroundColor: '#111827',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 12,
  },
  userItemRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  userItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  userItemEmail: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  noUsersText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
  buttonSmall: {
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmallRed: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  buttonSmallRedDark: {
    backgroundColor: '#3F1F21',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  buttonSmallText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  buttonSmallTextDark: {
    color: '#FCA5A5',
  },
});
