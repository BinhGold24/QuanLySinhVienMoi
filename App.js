
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import {
  khoiTaoDB,
  layDanhSachSinhVien,
  themSinhVien,
} from './database/SinhVienDB';

export default function App() {
  const [danhSachSinhVien, setDanhSachSinhVien] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [dangThem, setDangThem] = useState(false);

  const [maSV, setMaSV] = useState('');
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    khoiTaoDB()
      .then(() => layDanhSachSinhVien())
      .then((danhSach) => setDanhSachSinhVien(danhSach))
      .catch((loi) => {
        Alert.alert('Lỗi cơ sở dữ liệu', loi.message);
      })
      .finally(() => setDangTai(false));
  }, []);

  const taiLaiDanhSach = async () => {
    const danhSach = await layDanhSachSinhVien();
    setDanhSachSinhVien(danhSach);
  };

  const xuLyThemSinhVien = async () => {
    if (!maSV.trim() || !hoTen.trim() || !email.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      await themSinhVien(
        maSV.trim(),
        hoTen.trim(),
        email.trim()
      );

      await taiLaiDanhSach();

      setMaSV('');
      setHoTen('');
      setEmail('');
      setDangThem(false);

      Alert.alert('Thành công', 'Đã thêm sinh viên.');
    } catch (loi) {
      if (loi.message && loi.message.toLowerCase().includes('unique')) {
        Alert.alert('Lỗi', 'Mã sinh viên đã tồn tại.');
      } else {
        Alert.alert('Lỗi', 'Không thể thêm sinh viên: ' + loi.message);
      }
    }
  };

  const hienThiSinhVien = ({ item }) => (
    <View style={styles.theSinhVien}>
      <View style={styles.avatar}>
        <Text style={styles.chuAvatar}>
          {item.hoTen.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.thongTin}>
        <Text style={styles.hoTen}>{item.hoTen}</Text>
        <Text style={styles.chiTiet}>Mã SV: {item.maSV}</Text>
        <Text style={styles.chiTiet}>Email: {item.email}</Text>
      </View>
    </View>
  );

  if (dangTai) {
    return (
      <View style={styles.manHinhTai}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.chiTiet}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F1F5F9" />

     <Text style={styles.tieuDe}>QUẢN LÝ SINH VIÊN MỚI</Text>
      <Text style={styles.moTa}>
        Dữ liệu được lưu trong SQLite
      </Text>

      <TouchableOpacity
        style={styles.nutThem}
        onPress={() => setDangThem(!dangThem)}
      >
        <Text style={styles.chuNutThem}>
          {dangThem ? 'Đóng biểu mẫu' : '+ Thêm sinh viên'}
        </Text>
      </TouchableOpacity>

      {dangThem && (
        <ScrollView
          style={styles.bieuMau}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.tieuDeBieuMau}>Thông tin sinh viên</Text>

          <Text style={styles.nhan}>Mã sinh viên</Text>
          <TextInput
            style={styles.oNhap}
            placeholder="Ví dụ: SV001"
            value={maSV}
            onChangeText={setMaSV}
            autoCapitalize="characters"
          />

          <Text style={styles.nhan}>Họ và tên</Text>
          <TextInput
            style={styles.oNhap}
            placeholder="Nhập họ và tên"
            value={hoTen}
            onChangeText={setHoTen}
          />

          <Text style={styles.nhan}>Email</Text>
          <TextInput
            style={styles.oNhap}
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.nutLuu}
            onPress={xuLyThemSinhVien}
          >
            <Text style={styles.chuNutThem}>Lưu sinh viên</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <View style={styles.dongDanhSach}>
        <Text style={styles.tieuDeDanhSach}>Danh sách sinh viên</Text>
        <Text style={styles.soLuong}>
          {danhSachSinhVien.length} sinh viên
        </Text>
      </View>

      <FlatList
        data={danhSachSinhVien}
        keyExtractor={(item) => String(item.id)}
        renderItem={hienThiSinhVien}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.noiDungDanhSach}
        ListEmptyComponent={
          <Text style={styles.rong}>
            Chưa có sinh viên. Nhấn “Thêm sinh viên” để bắt đầu.
          </Text>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  manHinhTai: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  tieuDe: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  moTa: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 18,
  },
  nutThem: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 18,
  },
  chuNutThem: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bieuMau: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 16,
    maxHeight: 330,
  },
  tieuDeBieuMau: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 10,
  },
  nhan: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 5,
    marginTop: 5,
  },
  oNhap: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  nutLuu: {
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 8,
  },
  dongDanhSach: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tieuDeDanhSach: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  soLuong: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  noiDungDanhSach: {
    paddingBottom: 25,
  },
  theSinhVien: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chuAvatar: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },
  thongTin: {
    flex: 1,
  },
  hoTen: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 5,
  },
  chiTiet: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  rong: {
    textAlign: 'center',
    marginTop: 25,
    lineHeight: 22,
    color: '#64748B',
  },
});
