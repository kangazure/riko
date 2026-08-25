export type BlogCategory =
  | "cybersecurity"
  | "networking"
  | "mikrotik"
  | "olt-fiber"
  | "linux"
  | "web-security"
  | "devops"
  | "tech";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** ISO date, e.g. "2026-08-22" */
  date: string;
  category: BlogCategory;
  readingTime: string;
  featured?: boolean;
  tags: string[];
  content: string;
}

export const categoryMeta: Record<
  BlogCategory,
  { label: string; tagline: string; accent: string }
> = {
  cybersecurity: {
    label: "Cyber Security",
    tagline: "Recon, pentest, dan analisis keamanan.",
    accent: "#10b981",
  },
  networking: {
    label: "Networking",
    tagline: "Routing, switching, dan protokol jaringan.",
    accent: "#38bdf8",
  },
  mikrotik: {
    label: "MikroTik",
    tagline: "RouterOS untuk ISP dan network operations.",
    accent: "#fb7185",
  },
  "olt-fiber": {
    label: "OLT & Fiber Optic",
    tagline: "GPON, serat optik, dan troubleshooting lapangan.",
    accent: "#fbbf24",
  },
  linux: {
    label: "Linux",
    tagline: "Setup server, hardening, dan administrasi.",
    accent: "#fb923c",
  },
  "web-security": {
    label: "Web Security",
    tagline: "Kerentanan web dan cara mengamankan aplikasi.",
    accent: "#a78bfa",
  },
  devops: {
    label: "DevOps",
    tagline: "Deploy, container, dan otomasi infrastruktur.",
    accent: "#22d3ee",
  },
  tech: {
    label: "Tutorial Teknologi",
    tagline: "Panduan praktis seputar teknologi.",
    accent: "#a3a3a3",
  },
};

/** Estimate reading time from raw markdown content (~170 wpm). */
export function readingTimeOf(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 170));
  return `${minutes} menit`;
}

/** "12 Juli 2026" */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00`));
}

export const blogPosts: BlogPost[] = [
  {
    slug: "deploy-docker-produksi",
    title: "Deploy Aplikasi dengan Docker: Catatan dari Lapangan",
    description:
      "Pola Dockerfile dan docker-compose yang saya pakai untuk deploy aplikasi ke produksi — tanpa drama image kedaluwarsa atau container yang mati diam-diam.",
    date: "2026-08-22",
    category: "devops",
    readingTime: "",
    tags: ["docker", "deploy", "devops", "vps"],
    content:
      "Saya sudah cukup sering lihat orang install aplikasi langsung di server — git clone, jalanin, lalu lupa. Seminggu kemudian dependency berubah, aplikasi error, dan tidak ada yang tahu kenapa. Docker menyelesaikan masalah itu dengan cara yang sederhana: seluruh environment ikut di-commit bersama kode.\n\n## Prinsip yang Saya Pegang\n\nAda tiga hal yang saya pastikan sebelum container masuk produksi:\n\n1. **Image dipin** ke versi spesifik, bukan `:latest`. Image `latest` bisa berubah kapan saja dan merusak build yang tadi pagi masih hijau.\n2. **Aplikasi jalan sebagai non-root.** Kebanyakan image resmi sudah menyediakan user yang aman; pakai itu daripada default root.\n3. **Data penting tidak pernah ada di dalam container.** Selalu keluar ke volume atau bind mount.\n\n## Dockerfile yang Bisa Dipakai Ulang\n\nUntuk aplikasi Node.js, pola yang saya pakai kurang lebih begini:\n\n```dockerfile\nFROM node:22-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:22-alpine\nWORKDIR /app\nENV NODE_ENV=production\nCOPY --from=build /app/.next ./.next\nCOPY --from=build /app/public ./public\nCOPY --from=build /app/package*.json ./\nRUN npm ci --omit=dev\nUSER node\nEXPOSE 3000\nCMD [\"npm\", \"start\"]\n```\n\nPerhatikan `USER node` sebelum CMD — ini mencegah aplikasi jalan sebagai root, jadi kalau aplikasi berhasil dibobol, attacker tidak langsung dapat root di container. Multistage build juga membuat image final jauh lebih kecil karena tool build (compiler, devDependencies) tidak ikut terbawa.\n\n## Compose untuk Orchestrasi Sederhana\n\nKalau aplikasinya butuh database atau service pendamping, saya pakai `docker compose`:\n\n```yaml\nservices:\n  app:\n    build: .\n    restart: unless-stopped\n    environment:\n      - DATABASE_URL=postgres://app:secret@db:5432/app\n    depends_on:\n      - db\n  db:\n    image: postgres:16-alpine\n    restart: unless-stopped\n    volumes:\n      - pgdata:/var/lib/postgresql/data\nvolumes:\n  pgdata:\n```\n\n`restart: unless-stopped` itu penyelamat — container akan bangkit sendiri kalau server reboot atau prosesnya crash. Untuk satu VPS, pola ini jauh lebih mudah dirawat daripada mengelola service systemd per aplikasi.\n\n## Reverse Proxy dan HTTPS\n\nContainer sebaiknya tidak langsung terekspos ke internet. Di belakangnya saya taruh reverse proxy yang mengurus TLS — di project saya sekarang kebetulan Dokploy yang menangani itu, tapi prinsipnya sama dengan Caddy atau Nginx. HTTPS terminasi di proxy, kemudian traffic diteruskan ke container dalam network internal Docker.\n\n## Update yang Tidak Bikin Geger\n\nProsedur update yang saya pakai konsisten:\n\n1. Backup volume database dulu (jangan pernah skip ini).\n2. `docker compose build && docker compose up -d`.\n3. Cek log selama beberapa menit, verifikasi healthcheck.\n4. Kalau ada yang aneh, rollback dengan men-deploy image tag lama.\n\nKarena image versioning-nya jelas, rollback cuma soal menarik tag lama — ini alasan kenapa saya jarang deploy bare-metal lagi untuk aplikasi baru.\n\n## Jebakan yang Pernah Saya Temui\n\n- **Volume tidak di-backup**, lalu container dihapus oleh deploy tool — data hilang. Sekarang backup volume jadi agenda terjadwal.\n- **`node:latest` di Dockerfile** — build tiba-tiba rusak karena major version naik. Sekarang selalu pin versi.\n- **Port container dibuka ke publik** padahal tidak perlu. Container database sebaiknya tidak punya port mapping ke host sama sekali.\n\nDocker bukan alat ajaib, tapi kalau polanya benar, hidup jadi jauh lebih tenang. Rules-nya sederhana: pin image, non-root, data di luar container, dan selalu bisa rollback.",
  },
  {
    slug: "hardening-routeros",
    title: "Hardening RouterOS: Rutinitas Sebelum Router MikroTik Disusupi",
    description:
      "Checklist yang saya terapkan di setiap router MikroTik baru sebelum disambungkan ke jaringan — dari update firmware, firewall input, sampai backup terjadwal.",
    date: "2026-08-20",
    category: "mikrotik",
    readingTime: "",
    featured: false,
    tags: ["mikrotik", "routeros", "hardening", "firewall"],
    content:
      "Router MikroTik populer di Indonesia — harganya murah, fiturnya lengkap. Sayangnya, banyak yang langsung dipasang apa adanya: user `admin` tanpa password, Winbox dan API terbuka ke WAN, firmware tahun lalu. Saya pernah menangani ISP kecil yang ruter-nya kena brute force karena port 8291 (Winbox) kebuka ke internet. Semua ini sebenarnya bisa dicegah dengan 10 menit kerja di awal.\n\n## 1. Update RouterOS Lebih Dulu\n\nJangan konfigurasi panjang-panjang dulu sebelum firmware terbaru terpasang:\n\n```\n/system package update check-for-updates\n/system package update install\n```\n\nPatch keamanan RouterOS keluar rutin; beberapa di antaranya CVE yang serius (misalnya yang memungkinkan RCE lewat Winbox). Router yang tidak pernah di-update adalah kandidat botnet.\n\n## 2. User dan Akses\n\nDefault user `admin` tanpa password tidak boleh dibiarkan:\n\n```\n/user set admin password=GANTI_PASSWORD_KUAT\n# atau lebih tegas: hapus dan buat user sendiri\n/user remove admin\n/user add name=riko group=full password=...\n```\n\nKalau bisa, matikan autentikasi password untuk SSH dan pakai kunci saja:\n\n```\n/user ssh-keys import user=riko public-key-file=id_ed25519.pub\n/ip ssh set strong-crypto=yes\n```\n\n## 3. Firewall Input Chain — Paling Penting\n\nDefault RouterOS **mengizinkan semua input**. Ini yang pertama saya matikan. Aturannya: hanya layanan yang benar-benar dipakai yang boleh masuk, dan hanya dari interface yang tepat.\n\n```\n/ip firewall filter\nadd chain=input connection-state=established,related action=accept \\\n    comment=\"allow established\"\nadd chain=input connection-state=invalid action=drop\nadd chain=input in-interface=ether1 protocol=icmp action=accept \\\n    comment=\"allow ping dari WAN\"\nadd chain=input in-interface=bridge-local action=accept \\\n    comment=\"full access dari LAN\"\nadd chain=input action=drop comment=\"drop semua input lain\"\n```\n\nUrutannya penting: rule drop yang terakhir, dan jangan ada rule `input accept` di atas yang mengizinkan semuanya.\n\n## 4. Matikan Service yang Tidak Dipakai\n\nRouterOS menjalankan banyak service secara default:\n\n```\n/ip service set telnet disabled=yes\n/ip service set ftp disabled=yes\n/ip service set api disabled=yes\n/ip service set www disabled=yes\n/ip service set winbox address=192.168.1.0/24\n/ip service set ssh disabled=no\n/ip service set ssh address=192.168.1.0/24\n```\n\nBatasi alamat yang boleh mengakses Winbox dan SSH ke jaringan internal. Kalau butuh akses dari luar, lakukan lewat VPN, bukan dengan membuka port ke internet. `mac-winbox` dan neighbor discovery juga saya matikan di sisi WAN:\n\n```\n/ip neighbor discovery-settings set discover-interface-list=LAN\n/tool mac-server set allowed-interface-list=LAN\n```\n\nJangan lupa matikan bandwidth-test server kalau tidak dipakai — tool ini bisa dipakai untuk DoS router.\n\n## 5. Backup Terjadwal\n\nRouter yang sudah di-hardening tapi tidak punya backup itu seperti pekerjaan yang tidak pernah disimpan:\n\n```\n/system scheduler add name=backup-harian interval=1d on-event="/system backup save name=backup"\n/system scheduler add name=export-harian interval=1d on-event="/export file=export"\n```\n\nAmbil file `.backup` dan `.rsc` tersebut keluar dari router (misalnya lewat SCP atau FTP internal) dan simpan di tempat yang tidak satu lokasi dengan router-nya.\n\n## 6. Kebiasaan yang Membuat Tetap Aman\n\n- Catat semua perubahan di changelog sendiri, sekecil apa pun.\n- Cek log secara berkala: `/log print where topics~\"critical\"`.\n- Update firmware tiap beberapa bulan, bukan menunggu ada masalah.\n- Jangan pernah expose Winbox/API ke internet. Serius, ini penyebab paling umum router MikroTik di Indonesia ikut botnet.\n\nSepuluh menit di awal jauh lebih murah daripada semalam bongkar router yang sudah jadi korban brute force.",
  },
  {
    slug: "dasar-gpon-olt",
    title: "Dasar GPON: Memahami OLT, ONT, dan Splitter",
    description:
      "Arsitektur GPON dari sisi operator: kenapa satu core fiber bisa melayani puluhan pelanggan, dan apa arti angka-angka redaman yang sering muncul di dashboard OLT.",
    date: "2026-08-15",
    category: "olt-fiber",
    readingTime: "",
    featured: true,
    tags: ["gpon", "olt", "fiber optik", "isp"],
    content:
      "Kalau kamu pernah bertanya-tanya kenapa ISP fiber bisa pasang internet di rumahmu tanpa menarik kabel baru dari sentral — jawabannya ada di GPON. Teknologi ini adalah tulang punggung hampir semua ISP fiber di Indonesia, dan buat yang baru masuk ke dunia jaringan operator, memahami strukturnya lebih penting daripada hafal merk OLT.\n\n## PON Itu Point-to-Multipoint\n\nSebelum GPON, koneksi fiber biasanya point-to-point: satu core kabel dari sentral ke satu pelanggan. Boros banget — bayangkan biaya kabel untuk seribu pelanggan.\n\nGPON (Gigabit Passive Optical Network) memecahkan masalah ini dengan **passive splitter**. Satu core fiber dari OLT bisa dipecah menjadi 8, 16, 32, bahkan 64 cabang. Splitter tidak butuh listrik — dia cuma kaca yang membagi sinyal optik secara pasif.\n\n```\nOLT (sentral)  --  splitter 1:32  --  ONT pelanggan 1\n                             \\---  ONT pelanggan 2\n                              \\---  ...  sampai 32 pelanggan\n```\n\n## Kerja OLT, ONT, Splitter\n\n- **OLT (Optical Line Terminal)** — perangkat di sisi operator. Dialah yang mengatur jadwal pengiriman data ke setiap ONT dan menyediakan port untuk uplink ke jaringan core.\n- **ONT / ONU (Optical Network Terminal/Unit)** — perangkat di sisi pelanggan. Ini yang dipasang di dinding rumah.\n- **Splitter** — piranti pasif pembagi sinyal. Rasio umum 1:8, 1:16, 1:32; yang 1:64 mulai jarang dipakai karena budget daya optiknya tipis.\n\n## Kenapa Bisa Berbagi Satu Core?\n\nSinyal optiknya dibedakan oleh panjang gelombang dan waktu:\n\n- **Downstream (OLT → ONT):** 1490 nm, disiarkan (broadcast) ke semua ONT. Setiap ONT diberi kunci enkripsi agar hanya bisa membaca datanya sendiri.\n- **Upstream (ONT → OLT):** 1310 nm. Karena semua ONT berbagi satu core ke arah atas, OLT mengatur jadwal — tiap ONT dapat slot waktu (TDMA) untuk mengirim. Inilah kenapa kalau satu ONT bermasalah dan mengirim terus-menerus, kualitas semua pelanggan di splitter yang sama bisa turun. Di lapangan, ini biasanya gejala ONT hang atau yang disebut dengan istilah tuning burst loss.\n\n## Angka Redaman yang Wajib Dihafal\n\nBudget daya optik GPON kelas B+ (yang paling umum dipakai ISP Indonesia) kurang lebih **28 dB**. Artinya: dari OLT sampai ONT, total redaman tidak boleh melebihi angka itu.\n\nPatokan kasar yang biasa saya pakai:\n\n| Komponen | Loss tipikal |\n| --- | --- |\n| Konektor | 0.2 – 0.5 dB |\n| Fusion splice | 0.05 – 0.1 dB |\n| Kabel serat (per km) | 0.3 – 0.4 dB |\n| Splitter 1:8 | ~10.5 dB |\n| Splitter 1:16 | ~13.5 dB |\n| Splitter 1:32 | ~16.5 dB |\n\nTerlihat kan kenapa splitter 1:64 mulai berisiko: ambil 16.5 dB di splitter 1:32, tambah jarak, tambah konektor dan splice — tinggal sedikit sisa untuk error margin.\n\n## Di Lapangan, yang Sering Terjadi\n\n- Pelanggan komplain internet putus / ONT LOS berkedip — ternyata splitter di tiang kena air atau konektor kotor. Redaman naik dari -20 dBm ke -30 dBm.\n- ONT terdaftar tapi tidak aktif — biasanya salah pilih ONT (model lama GPON vs XGS-PON) atau ONT pin builder tidak sesuai profile.\n- Satu core PON penuh 32 ONT dan lambat — bukan salah GPON-nya, tapi bandwidth uplink dari OLT yang kekurangan.\n\nGPON akan tetap dipakai bertahun-tahun ke depan, dan XGS-PON mulai naik untuk pelanggan >1 Gbps. Tapi fondasi pemahamannya sama: paham redaman, paham splitter, paham siapa yang pasif dan aktif di jaringan. Itu yang bikin troubleshooting di lapangan terasa jauh lebih tenang.",
  },
  {
    slug: "setup-server-linux-pertama",
    title: "Server Linux Pertama: SSH Kunci, Firewall, dan Kebiasaan Aman",
    description:
      "Checklist setup VPS baru dari nol — kunci SSH ed25519, non-root user, firewall, dan rutinitas update yang saya lakukan di setiap server.",
    date: "2026-08-10",
    category: "linux",
    readingTime: "",
    featured: false,
    tags: ["linux", "server", "ssh", "vps"],
    content:
      "VPS baru biasanya datang dengan user `root` dan akses via password. Banyak orang langsung install aplikasi dan lupa mengamankan aksesnya. Padahal port 22 server baru di internet itu seperti pintu rumah tanpa kunci di lingkungan yang penuh orang iseng — brute force SSH adalah salah satu suara paling umum di log server mana pun.\n\n## 1. Kunci SSH, Bukan Password\n\nBuat pasangan kunci di laptop kamu (bukan di server):\n\n```bash\nssh-keygen -t ed25519 -C \"riko@laptop\"\n```\n\nEd25519 sudah jadi pilihan default yang tepat di 2026 — cepat dan aman. Kalau terpaksa RSA (misalnya karena tools lama), gunakan minimal 4096 bit.\n\nKirim kunci publiknya ke server:\n\n```bash\nssh-copy-id root@IP_SERVER\n# kalau ssh-copy-id tidak ada, tempel manual:\ncat ~/.ssh/id_ed25519.pub | ssh root@IP_SERVER \"mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys\"\n```\n\n## 2. User Non-Root dan Sudo\n\nJangan kerja sebagai root setiap hari. Satu typo sebagai root bisa merusak server:\n\n```bash\nadduser riko\nusermod -aG sudo riko\n```\n\nUji dulu login sebagai `riko` dan pastikan `sudo` jalan, **baru** kunci akses root.\n\n## 3. Hardening SSH\n\nEdit `/etc/ssh/sshd_config`:\n\n```\nPermitRootLogin no\nPasswordAuthentication no\nPubkeyAuthentication yes\n```\n\nLalu restart SSH:\n\n```bash\nsudo systemctl restart ssh\n```\n\nPastikan kamu membuka sesi SSH baru dan bisa login dengan kunci SEBELUM menutup sesi lama. Kesalahan paling umum di step ini adalah mengunci diri sendiri keluar. Kalau ini terjadi dan kamu tidak punya akses panel VPS, cukup buka console dari panel provider.\n\n## 4. Firewall\n\nUFW di Ubuntu/Debian itu simpel dan sudah cukup:\n\n```bash\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow OpenSSH\nsudo ufw enable\n```\n\nAturan untuk app lain ditambahkan belakangan — web server, database, dan seterusnya. Jangan lupa bahwa database sebaiknya tidak mendengarkan di IP publik sama sekali.\n\n## 5. Update yang Terjadiwal\n\nServer yang tidak pernah di-update adalah server yang menunggu masalah. Di Debian/Ubuntu:\n\n```bash\nsudo apt update && sudo apt full-upgrade -y\nsudo apt install unattended-upgrades\nsudo dpkg-reconfigure --priority=low unattended-upgrades\n```\n\nUntuk security patch, `unattended-upgrades` akan otomatis menjalankannya. Pengecekan manual tetap saya lakukan sebulan sekali, sekalian lihat log.\n\n## 6. Kebiasaan Kecil yang Besar Dampaknya\n\n- **Timezone**: `sudo timedatectl set-timezone Asia/Jakarta`. Log yang waktunya 7 jam lebih cepat itu menyebalkan saat tracing insiden.\n- **Hostname rapi**: ganti dari default `localhost` biar tidak bingung kalau manage banyak server.\n- **Fail2ban opsional**: kalau PasswordAuthentication sudah dimatikan, manfaatnya kecil. Kalau masih terpaksa pakai password di beberapa server, fail2ban wajib.\n- **Backup `/etc`**: untuk server yang banyak konfigurasinya, saya taruh `/etc` di git atau backup rutin — restore jauh lebih cepat.\n\nSetup awal di atas menghabiskan sekitar 15 menit, tapi efeknya berlapis: kunci SSH mematikan brute force, firewall membatasi permukaan serangan, dan rutinitas update mencegah masalah di bulan depan. Server pertama yang saya setup dulu tidak melakukan setengah dari ini — dan iya, log-nya penuh percobaan login.",
  },
  {
    slug: "sql-injection-dasar",
    title: "SQL Injection Bukan Hantu: Memahami dan Mencegahnya dari Kode",
    description:
      "Dari query string yang di-concat sampai prepared statement — bagaimana SQL injection bekerja, kenapa masih banyak ditemukan, dan cara menutupnya di level kode.",
    date: "2026-08-05",
    category: "web-security",
    readingTime: "",
    featured: true,
    tags: ["sql injection", "owasp", "web security", "aplikasi web"],
    content:
      "Setiap kali saya audit aplikasi web, hal pertama yang saya cek adalah bagaimana aplikasi menyusun query database. Bukan karena rumit, tapi karena SQL injection tetap bertahan sebagai salah satu kerentanan paling umum di aplikasi web — termasuk aplikasi yang dibangun tahun ini. Masalahnya hampir selalu sama: input pengguna dimasukkan mentah-mentah ke dalam query.\n\n## Seperti Apa Serangannya\n\nBayangkan login form yang query-nya disusun seperti ini:\n\n```php\n$query = \"SELECT * FROM users WHERE username = '\" . $_POST['username'] . \"' AND password = '\" . $_POST['password'] . \"'\";\n```\n\nKalau attacker mengirim `username` berisi `' OR '1'='1` dan password apa pun:\n\n```sql\nSELECT * FROM users WHERE username = '' OR '1'='1' AND password = 'x'\n```\n\nKarena `'1'='1'` selalu benar, query mengembalikan baris pertama — sering kali user admin. Login berhasil tanpa tahu password. Itu bentuk paling klasik, disebut juga tautologi.\n\nKerentanan yang sama bisa dipakai untuk hal yang lebih parah:\n\n- **UNION-based** — menggabungkan hasil query dengan data dari tabel lain, misalnya mengambil kolom password hash dari tabel `users`.\n- **Error-based** — memancing error SQL agar database membocorkan nama tabel dan kolom.\n- **Blind** — bertanya ya/tidak ke database lewat selisih respons, satu karakter per satu. Lambat, tapi bekerja bahkan ketika error tidak ditampilkan.\n\n## Kenapa Ini Masih Sering Terjadi\n\nPola yang saya temui di lapangan biasanya salah satu dari ini:\n\n1. **Kode lama diwariskan** — aplikasi internal yang dibuat 10 tahun lalu dengan string concat, masih dipakai karena \"jalan kok\".\n2. **Anggapan keliru** — \"aplikasi ini internal, hacker mana mau repot\" — padahal aplikasi internal juga bisa kena port forwarding atau employee dengan data yang bocor.\n3. **Validasi dianggap cukup** — filter sebagian karakter lalu merasa aman. Blacklist karakter itu rapuh; ada seribu cara menulis payload yang sama.\n\nDulu saya pernah audit aplikasi client yang seluruh query-nya string concat. Pimpinan IT-nya bilang aplikasi itu \"tidak penting\" — sampai database-nya ikut di-encrypt ransomware lewat aplikasi yang sama. Semua itu berawal dari satu input yang tidak di-escape.\n\n## Pencegahannya Sederhana: Prepared Statement\n\nKunci utamanya bukan memfilter input, tapi **memisahkan data dari perintah**. Dengan prepared statement / parameterized query, nilai yang dikirim pengguna tidak pernah diinterpretasi sebagai SQL:\n\n```php\n$stmt = $pdo->prepare(\"SELECT * FROM users WHERE username = ? AND password = ?\");\n$stmt->execute([$_POST['username'], $_POST['password']]);\n```\n\nMySQLi, PostgreSQL, SQLite, dan semua driver modern mendukung pola ini. Kalau pakai ORM (Prisma, Sequelize, Doctrine, dsb), pemakaian yang benar juga otomatis parameterized — jangan jatuh ke godaan memakai method \"raw query\" tanpa perlu.\n\nLapisan-lapisannya:\n\n1. **Prepared statement / ORM** — pertahanan utama, selalu.\n2. **User database berprivilege minim** — aplikasi web tidak butuh hak `DROP DATABASE`; pisahkan user untuk tiap aplikasi.\n3. **Jangan tampilkan error mentah** — error SQL yang detail itu peta untuk attacker. Log di server, tampilkan pesan umum ke user.\n4. **WAF sebagai lapisan tambahan**, bukan pengganti — boleh dipasang, tapi jangan merasa aman hanya karena ada WAF.\n\nSQL injection bukan ilmu sihir dan pencegahannya juga bukan. Prepared statement itu satu kata kunci yang menyelesaikan ~90% kasus. Sisanya adalah disiplin: jangan pernah menulis query yang menggabungkan input pengguna ke dalam string SQL.",
  },
  {
    slug: "wireguard-di-mikrotik",
    title: "VPN WireGuard di MikroTik: Menghubungkan Kantor Cabang",
    description:
      "Kenapa WireGuard jadi pilihan saya menggantikan L2TP dan OpenVPN untuk site-to-site, lengkap dengan konfigurasi di RouterOS dan jebakan NAT yang sering bikin bingung.",
    date: "2026-07-26",
    category: "mikrotik",
    readingTime: "",
    featured: false,
    tags: ["wireguard", "vpn", "mikrotik", "routeros"],
    content:
      "Kantor cabang yang butuh akses ke server pusat — ini kebutuhan yang hampir selalu muncul, baik untuk perusahaan kecil maupun ISP. Dulu saya pakai L2TP/IPsec atau OpenVPN untuk ini. Keduanya berfungsi, tapi WireGuard sejak masuk RouterOS 7 benar-benar mengubah cara saya membangun tunnel antar kantor: konfigurasinya jauh lebih pendek, overhead-nya lebih rendah, dan koneksi bangkit kembali secara otomatis.\n\n## Kenapa WireGuard\n\n- **Kinerja** — berjalan di kernel, enkripsi modern (ChaCha20), jauh lebih ringan dibanding OpenVPN yang user-space.\n- **Sederhana** — konsepnya cuma interface, private key, dan peer. Tidak ada sertifikat, tidak ada fase handshake berlapis seperti IPsec.\n- **Baik untuk NAT** — pakai UDP port tunggal dan persistent keepalive, jadi tunnel bertahan meski di belakang router rumahan.\n\nPerbandingan singkat dengan yang lain: PPTP sudah selayaknya ditinggalkan (protokolnya bobol). L2TP/IPsec masih oke tapi konfigurasinya lebih ribet dan ada overhead ganda. OpenVPN fleksibel tapi berat untuk throughput besar. Untuk site-to-site dengan MikroTik di dua sisi, WireGuard adalah jalan paling mulus.\n\n## Konfigurasi di RouterOS 7\n\nPertama, buat interface dan key pair di router pusat:\n\n```\n/interface wireguard add name=wg1 listen-port=51820\n/interface wireguard peers\n```\n\nKey akan muncul di property interface — catat public key-nya, ini yang nanti didaftarkan di sisi lawan:\n\n```\n/interface wireguard print detail\n```\n\nTentukan IP tunnel. Saya biasa pakai subnet /30 khusus tunnel, misalnya `10.99.0.1/30` untuk pusat dan `10.99.0.2/30` untuk cabang:\n\n```\n/ip address add address=10.99.0.1/30 interface=wg1\n```\n\nTambah peer cabang. `allowed-address` menentukan prefix yang sah lewat tunnel dari sisi peer — di pusat, ini subnet LAN cabang:\n\n```\n/interface wireguard peers add \\\n  interface=wg1 \\\n  public-key=\"PUBLIC_KEY_CABANG\" \\\n  allowed-address=192.168.20.0/24,10.99.0.2/32 \\\n  endpoint-address=ENDPOINT_CABANG \\\n  endpoint-port=51820 \\\n  persistent-keepalive=25s\n```\n\nTerakhir, routing: beri tahu router bahwa subnet LAN cabang dicapai lewat tunnel:\n\n```\n/ip route add dst-address=192.168.20.0/24 gateway=wg1\n```\n\nDi sisi cabang, konfigurasinya dicerminkan: peer dengan public key pusat, `allowed-address` berisi subnet LAN pusat plus IP tunnel pusat, dan route ke `192.168.10.0/24` via `wg1`.\n\n## Jebakan yang Sering Terjadi\n\n- **Allowed-address kurang** — kalau `allowed-address` tidak mencakup IP sumber/network lawan, packet diam-diam dibuang. Gejala paling umum: tunnel up tapi ping tidak pernah nyambung.\n- **Firewall memblokir UDP 51820** — jangan lupa tambahkan rule input untuk port WireGuard dari WAN. Saya pernah menghabiskan satu jam karena ini.\n- **Endpoint berubah (dynamic IP)** — untuk kantor cabang yang IP-nya berubah-ubah, pasang DDNS dan jadikan `endpoint-address` mengikuti hostname. `persistent-keepalive` juga wajib di sisi yang NAT, biar tunnel tidak \"tidur\".\n- **Client Windows/mobile** — buat koneksi dari laptop, export profile WireGuard dari router cukup dengan mengubah `allowed-address` menjadi `0.0.0.0/0` untuk full tunnel, atau prefix server saja untuk split tunnel.\n\n## Pengalaman Pakai di Lapangan\n\nSetelah migrasi beberapa kantor cabang dari L2TP ke WireGuard, keluhan \"VPN lemot\" hilang dengan sendirinya — overhead yang kecil terasa jelas, terutama di link yang bandwidth-nya pas-pasan. Konfigurasinya juga jadi sesuatu yang bisa saya jelaskan ke teknisi lain dalam lima menit, tanpa presentasi slide tentang fase-fase IPsec.\n\nMulai dari lab kecil — dua RB (atau bahkan satu RB plus laptop Linux) — sebelum diterapkan ke produksi. WireGuard itu salah satu teknologi langka yang persis seperti janjinya: lebih sederhana dan lebih cepat.",
  },
  {
    slug: "mengenal-nmap",
    title: "Mengenal Nmap: Network Mapper untuk Security Scanning",
    description:
      "Panduan awal memahami Nmap — dari basic scan sampai service detection — dan bagaimana tool ini digunakan dalam security assessment.",
    date: "2026-07-12",
    category: "cybersecurity",
    readingTime: "",
    featured: true,
    tags: ["nmap", "recon", "security scanning", "cybersecurity"],
    content: `Nmap (Network Mapper) adalah tool open-source yang digunakan untuk network discovery dan security auditing. Buat yang baru masuk ke dunia cybersecurity, Nmap biasanya jadi salah satu tool pertama yang dipelajari.

## Kenapa Nmap?

Nmap membantu kita memahami apa yang ada di dalam sebuah network — host mana yang aktif, port apa yang terbuka, service apa yang berjalan, dan bahkan OS yang digunakan oleh target. Informasi ini jadi dasar sebelum melakukan security assessment lebih lanjut.

## Basic Scan

Perintah paling dasar:

\`\`\`bash
nmap 192.168.1.1
\`\`\`

Ini akan melakukan scan terhadap 1000 port paling umum di host tersebut. Output-nya akan menunjukkan port yang terbuka beserta service yang berjalan.

## Scan Types

Ada beberapa jenis scan yang umum digunakan:

- **TCP SYN Scan (-sS)** — Default scan, cepat dan relatif stealth karena tidak menyelesaikan three-way handshake.
- **TCP Connect Scan (-sT)** — Melakukan full connection, lebih mudah terdeteksi.
- **UDP Scan (-sU)** — Untuk men-scan port UDP, biasanya lebih lambat.
- **Service Detection (-sV)** — Mendeteksi versi service yang berjalan di port terbuka.
- **OS Detection (-O)** — Mencoba mengidentifikasi operating system target.

## Contoh Penggunaan

\`\`\`bash
# Quick scan
nmap -F 192.168.1.0/24

# Service + OS detection
nmap -sV -O 192.168.1.1

# Full port scan
nmap -p- 192.168.1.1

# Script scan
nmap --script=vuln 192.168.1.1
\`\`\`

## Hal yang Perlu Diingat

Nmap hanya boleh digunakan pada sistem yang kamu punya izin untuk men-scan. Scanning tanpa izin bisa dianggap sebagai aktivitas ilegal di banyak negara. Selalu pastikan kamu bekerja di environment yang sah (lab sendiri, CTF, atau sistem yang kamu punya otorisasi tertulis).`,
  },
  {
    slug: "troubleshooting-redaman-fiber",
    title: "Praktik Troubleshooting Redaman Serat Optik di Lapangan",
    description:
      "Dari OPM sampai OTDR — alur kerja memeriksa redaman serat optik ketika pelanggan komplain LOS atau internet putus-putus, plus angka-angka patokan yang saya pakai.",
    date: "2026-07-08",
    category: "olt-fiber",
    readingTime: "",
    featured: false,
    tags: ["fiber optik", "otdr", "troubleshooting", "olt"],
    content:
      "Komplain pelanggan yang paling sering di ISP fiber bukan \"lemot\", tapi \"LOS\" atau \"internet putus-putus\". Di balik gejala itu, biasanya ada satu cerita yang sama: daya optik di ONT drop di bawah ambang sensitivitas. Artikel ini adalah alur yang saya pakai di lapangan untuk melacak masalah redaman, dari yang paling cepat sampai yang paling teliti.\n\n## Mulai dari Angka\n\nSebelum pegang alat, ingat patokan ini:\n\n- Sensitivitas RX ONT GPON biasanya **-27 dBm** sampai **-28 dBm**.\n- Daya terima ONT yang sehat: **-15 dBm sampai -23 dBm**.\n- Kalau sudah di **-25 dBm ke bawah**, cenderung bermasalah — angka di ujung budget.\n\nJadi aturan praktis saya: kalau RX di ONT di bawah -25 dBm, mulai cari sumber redaman.\n\n## Alur Kerja di Lapangan\n\n### 1. Cek dari yang Paling Mudah\n\n- Log masuk ke ONT (umumnya via IP default atau app manajemen) dan cek RX power.\n- Cek konektor di ONT: lepas, bersihkan, pasang kembali. Konektor kotor atau longgar adalah penyebab nomor satu redaman berlebih. Debu di ujung konektor bisa menambah loss beberapa dB — kadang cukup bikin ONT drop.\n- Pastikan kabel patchcord tidak tertekuk tajam (bending radius). Kabel drop yang pernah dilipat 90 derajat di belakang meja TV itu sering jadi biang kerok.\n\n### 2. Ukur dengan OPM\n\nKalau masih aneh, ukur di titik splitter:\n\n1. Buka konektor di port splitter yang menuju pelanggan tersebut.\n2. Sambungkan ke OPM (optical power meter) — catat dayanya.\n3. Bandingkan dengan port splitter lain yang sehat untuk memastikan output splitter normal.\n\nSatu hal yang perlu diingat: merahasiakan angka ini tidak akan membantu siapa pun. Catat baseline-nya — RX normal pelanggan itu berapa, supaya lain kali bisa langsung ketahuan \"ini lebih jelek dari biasanya\".\n\n### 3. OTDR untuk Menemukan di Mana\n\nOPM hanya bilang \"ada masalah\", OTDR yang bilang \"di mana\". Trace OTDR dari titik splitter ke arah pelanggan akan menunjukkan:\n\n- **Event loss besar di jarak tertentu** — konektor kotor, splice jelek, atau bending.\n- **Refleksi tinggi** — ujung kabel terbuka / konektor tidak terpasang.\n- **Ujung trace pendek** — kabel putus di jarak itu.\n\nContoh trace \"putus-putus\" yang sering saya lihat: satu splice yang dulu disambung buru-buru (loss >0.5 dB), lalu ditambah bending di titik lain, dan hasil kumulatifnya membuat ONT di ujung -27 dBm.\n\n### 4. Kasus Klasik yang Berulang\n\nPola yang pernah saya tangani berkali-kali:\n\n- **\"Putus tiap malam hujan\"** — air masuk ke closure (kotak penyambungan) di tiang. Kabel dalam kondisi basah dan konektor oksidasi; redaman naik kalau hujan karena air itu penghantar dan mengubah indeks di titik splice. Solusinya: buka closure, keringkan, re-splice kalau perlu, dan pastikan seal-nya baik. OTDR biasanya menunjukkan event loss di jarak lokasi closure itu.\n- **\"Setelah renovasi rumah, internet mati\"** — kabel drop ke rumah terinjak atau kejepit. Trace putus di ujung; solusinya tarik ulang kabel drop.\n- **\"Daya turun pelan-pelan\"** — splitter perlu dicek: konektor yang sudah dipasang-turun berkali-kali bisa kendor dan loss-nya naik.\n\n## Kesalahan Umum di Lapangan\n\n- **APC dicampur UPC** — konektor hijau (APC) dan biru (UPC) itu beda polish. Mencampurnya menghasilkan loss besar dan bisa merusak ferrule. Cek warna ujung konektor sebelum colok.\n- **Membersihkan dengan alkohol tapi tidak kering** — alkohol bisa meninggalkan residu; pakai konektor cleaner kering dulu, lalu konfirmasi dengan inspeksi.\n- **Ping-pong ganti ONT** — mengganti ONT tanpa mengukur dulu itu logika terbalik. Ukur dulu, ganti kalau memang ONT-nya yang rusak (ditandai TX rendah atau tidak stabil).\n\nRedaman yang sehat itu bukan keberuntungan — hasil dari alat yang benar, angka patokan yang dihafal, dan catatan baseline yang rapi. Tiga hal itu yang membedakan teknisi yang main tebak-tebakan dengan yang menyelesaikan masalah sekali jalan.",
  },
  {
    slug: "dasar-web-security",
    title: "Dasar-Dasar Web Security: OWASP Top 10",
    description:
      "Pengenalan OWASP Top 10 — kategori kerentanan web paling kritis dan bagaimana cara mitigasinya.",
    date: "2026-06-28",
    category: "web-security",
    readingTime: "",
    featured: true,
    tags: ["owasp", "web security", "kerentanan", "mitigasi"],
    content: `OWASP (Open Web Application Security Project) merilis daftar Top 10 kerentanan web security paling kritis setiap beberapa tahun. Daftar ini jadi acuan standar buat developer dan security practitioner.

## Kenapa OWASP Top 10 Penting?

Karena daftar ini merangkum kerentanan yang paling sering ditemukan dan paling berdampak di aplikasi web. Memahami setiap kategori membantu kita membangun aplikasi yang lebih aman dari awal.

## Kategori-Kategori Utama

### 1. Broken Access Control
User bisa mengakses data atau fitur yang seharusnya tidak bisa mereka akses. Contoh: user biasa bisa melihat data admin hanya dengan mengubah ID di URL.

### 2. Cryptographic Failures
Data sensitif tidak dienkripsi dengan benar — baik saat transit (no HTTPS) maupun saat disimpan (password di-plaintext).

### 3. Injection
Attacker mengirimkan data berbahaya ke interpreter. SQL injection adalah contoh paling umum: memasukkan query SQL lewat input form.

### 4. Insecure Design
Aplikasi didesain tanpa mempertimbangkan security dari awal. Ini bukan bug, tapi cacat desain.

### 5. Security Misconfiguration
Server, database, atau framework tidak dikonfigurasi dengan aman. Default credentials, error messages yang terlalu verbose, unnecessary features yang tetap aktif.

### 6. Vulnerable Components
Menggunakan library atau dependency yang sudah diketahui memiliki kerentanan tanpa di-update.

### 7. Authentication Failures
Mekanisme login yang lemah — password bisa di-brute-force, session token bisa ditebak, tidak ada rate limiting.

### 8. Software and Data Integrity Failures
Pipeline CI/CD tidak aman, dependency bisa di-supply-chain-attack, update otomatis tanpa verifikasi.

### 9. Logging and Monitoring Failures
Tidak ada logging yang memadai untuk mendeteksi dan merespons serangan yang sedang berlangsung.

### 10. SSRF (Server-Side Request Forgery)
Server bisa dipaksa membuat request ke URL yang dikontrol attacker, membuka akses ke internal network.

## Mulai dari Mana?

Kalau baru mulai, fokus ke OWASP Juice Shop (aplikasi web yang sengaja dibuat vulnerable untuk latihan) dan pelajari setiap kategori sambil praktek.`,
  },
  {
    slug: "dasar-vlan",
    title: "Dasar VLAN: Virtual LAN dan Segmentasi Jaringan",
    description:
      "Memahami konsep VLAN, cara kerjanya, dan bagaimana VLAN digunakan untuk segmentasi jaringan.",
    date: "2026-06-15",
    category: "networking",
    readingTime: "",
    featured: false,
    tags: ["vlan", "switching", "segmentasi", "jaringan"],
    content: `VLAN (Virtual Local Area Network) adalah teknologi yang memungkinkan kita membagi satu physical switch menjadi beberapa logical network yang terpisah.

## Konsep Dasar

Tanpa VLAN, semua device yang terhubung ke switch yang sama berada dalam satu broadcast domain. Artinya, broadcast dari satu device akan diterima oleh semua device lain — ini tidak efisien dan kurang aman.

Dengan VLAN, kita bisa mengelompokkan port-port switch ke dalam group yang berbeda. Device di VLAN 10 tidak bisa berkomunikasi langsung dengan device di VLAN 20, meskipun mereka terhubung ke switch yang sama.

## Kenapa Perlu VLAN?

1. **Keamanan** — Pisahkan traffic departemen yang berbeda (Finance vs Engineering)
2. **Performansi** — Kurangi broadcast domain yang terlalu besar
3. **Manajemen** — Struktur jaringan lebih fleksibel, tidak terikat lokasi fisik

## Cara Kerja

VLAN bekerja di Layer 2. Setiap frame Ethernet diberi tag VLAN (802.1Q) yang mengidentifikasi VLAN mana frame tersebut berasal. Switch menggunakan tag ini untuk memastikan frame hanya dikirim ke port yang ada di VLAN yang sama.

## Konfigurasi Dasar di MikroTik

\`\`\`
/interface vlan add name=vlan10 vlan-id=10 interface=ether1
/interface vlan add name=vlan20 vlan-id=20 interface=ether1
\`\`\`

Untuk routing antar VLAN, kamu butuh router (Layer 3) — ini disebut inter-VLAN routing.

VLAN adalah fondasi dari hampir semua desain jaringan modern. Bahkan di network kecil sekalipun, segmentasi VLAN bisa bikin manajemen network lebih rapi.`,
  },
  {
    slug: "install-kali-virtualbox",
    title: "Lab Keamanan di Laptop: Install Kali Linux di VirtualBox",
    description:
      "Panduan praktis membangun lab penetration testing di VirtualBox — dari setup VM, guest additions, sampai kebiasaan snapshot yang menyelamatkan hidup.",
    date: "2026-06-05",
    category: "tech",
    readingTime: "",
    featured: false,
    tags: ["kali linux", "virtualbox", "lab", "tutorial"],
    content:
      "Kalau kamu mau belajar keamanan jaringan dengan benar, kamu butuh tempat untuk mencoba-coba tanpa merusak sistem utama. VirtualBox plus Kali Linux adalah cara paling murah dan paling aman untuk memulai — laptop standar saja cukup. Ini panduan yang saya pakai setiap kali menyiapkan lab untuk teman atau peserta pelatihan.\n\n## Kenapa Virtual Machine?\n\nTiga alasan utama:\n\n1. **Isolasi** — serangan, malware, atau tool yang rusak tidak menyentuh sistem utama.\n2. **Snapshot** — sebelum mencoba exploit, ambil snapshot. Kalau sistem hancur, kembali ke snapshot dalam hitungan detik. Ini kebiasaan yang paling sering menyelamatkan saya.\n3. **Murah** — tidak perlu beli hardware tambahan; RAM 8 GB di host sudah cukup nyaman untuk Kali + target.\n\n## Langkah Instalasi\n\n### 1. Siapkan Berkas\n\nDownload VirtualBox dan image Kali Linux (format `.iso` atau `.vdi` — versi VirtualBox). Pastikan virtualisasi hardware aktif di BIOS (Intel VT-x / AMD-V) — kalau tidak, VM bakal jalan sangat lambat.\n\n### 2. Buat VM\n\nSetting yang biasa saya pakai:\n\n- **Type**: Linux, Debian (64-bit)\n- **RAM**: 4096 MB (kalau host RAM 8 GB, ini batas nyaman)\n- **CPU**: 2 core\n- **Disk**: 40 GB, dynamic allocated (tidak langsung terkonsumsi, tumbuh sesuai kebutuhan)\n- **Network**: NAT dulu untuk internet, nanti tambah Host-Only untuk lab\n\n### 3. Install Kali\n\nBoot dari ISO, pilih **Graphical Install**, ikuti wizard. Saat disk partitioning, pilih **Guided — use entire disk** supaya tidak ribet. Password root jangan lupa — nanti dipakai terus.\n\n### 4. Guest Additions\n\nIni yang membuat VM terasa seperti laptop sungguhan: resolusi layar penuh, clipboard bersama, dan shared folder.\n\n```bash\nsudo apt update && sudo apt install -y build-essential linux-headers-$(uname -r)\nsudo mount /dev/cdrom /mnt\ncd /mnt && sudo ./VBoxLinuxAdditions.run\n```\n\nReboot setelah selesai.\n\n### 5. Setup Network Lab\n\nIni bagian yang paling sering salah dipahami. Untuk latihan yang aman:\n\n- **NAT** — untuk akses internet dari VM.\n- **Host-Only Adapter** — jaringan virtual yang hanya bisa diakses host dan VM. Target lab (Metasploitable, DVWA) saya taruh di sini.\n\nSkenario yang bagus untuk pemula: target di Host-Only `192.168.56.0/24`, Kali di network yang sama, dan serangan dilakukan dari Kali ke target. Internet tidak tersentuh, tidak ada risiko menyasar perangkat orang lain.\n\n## Setelah Install: Kebiasaan Lab\n\n- **Update dulu**: `sudo apt update && sudo apt upgrade -y`. Kali yang baru diinstall tidak otomatis ter-update.\n- **Ambil snapshot** setelah setup bersih. Snapshot ini jadi "base image" kamu — cukup sekali setup, lalu clone untuk lab-lab berikutnya.\n- **Ganti password default** kalau VM-nya akan dipakai bersama (misalnya untuk training).\n- **Jangan pernah** men-scan jaringan yang bukan milikmu, bahkan dari dalam VM. Hukum tidak peduli siapa yang klik tombol scan.\n\n## Target Latihan yang Direkomendasikan\n\n- **Metasploitable 2** — VM sengaja vulnerable untuk latihan exploit.\n- **DVWA** — aplikasi web penuh kerentanan klasik untuk belajar web security.\n- **OWASP Juice Shop** — versi modern dan lebih menantang dari DVWA.\n\nDengan setup di atas, kamu punya lab yang siap dipakai kapan saja dan bisa dihancurkan sesuka hati tanpa rasa takut. Semakin sering kamu main di lab, semakin cepat keterampilan itu terbentuk — dan semakin jelas batas antara yang boleh dan tidak boleh dilakukan di jaringan sungguhan.",
  },
  {
    slug: "linux-untuk-security",
    title: "Linux untuk Cybersecurity: Setup dan Tools Dasar",
    description:
      "Kenapa Linux jadi OS pilihan di dunia cybersecurity dan tools apa saja yang perlu kamu kenali.",
    date: "2026-05-22",
    category: "linux",
    readingTime: "",
    featured: false,
    tags: ["linux", "kali linux", "tools", "cybersecurity"],
    content: `Linux adalah operating system yang mendominasi dunia cybersecurity — dari penetration testing, forensics, sampai server security. Artikel ini membahas kenapa Linux jadi pilihan utama dan tools dasar yang perlu kamu kenali.

## Kenapa Linux?

1. **Open Source** — Kamu bisa melihat, memodifikasi, dan memahami setiap bagian dari sistem.
2. **Control** — Linux memberi kontrol penuh atas networking stack, filesystem, dan kernel parameters.
3. **Tooling** — Mayoritas security tools dibuat untuk Linux first (atau Linux-only).
4. **Customizability** — Bisa di-strip down untuk jadi dedicated security appliance.

## Distro untuk Cybersecurity

- **Kali Linux** — Standard untuk penetration testing, pre-loaded dengan ratusan tools.
- **Parrot OS** — Alternatif Kali, lebih ringan, fokus ke privacy juga.
- **Ubuntu / Debian** — Buat daily driver, bisa di-install tools security secara manual.

## Tools Dasar yang Perlu Dikenal

### Network
- **Nmap** — Network scanning dan discovery
- **Wireshark** — Packet analysis
- **tcpdump** — Command-line packet capture
- **netcat** — Swiss army knife networking

### Web
- **Burp Suite** — Web application security testing
- **SQLmap** — SQL injection automation
- **dirb / gobuster** — Directory enumeration
- **ffuf** — Fast web fuzzer

### Exploitation
- **Metasploit** — Exploitation framework
- **searchsploit** — Exploit database search
- **John the Ripper / Hashcat** — Password cracking

## Setup Awal

Setelah install Kali (atau distro lain), hal pertama yang biasanya dilakukan:

\`\`\`bash
# Update semua package
sudo apt update && sudo apt upgrade -y

# Install tools tambahan
sudo apt install seclists wordlists dirb gobuster ffuf

# Setup terminal multiplexer
sudo apt install tmux
\`\`\`

Linux bukan sekadar OS buat cybersecurity — ini adalah skill fundamental. Semakin dalam kamu paham Linux, semakin efektif kamu sebagai security practitioner.`,
  },
  {
    slug: "mengenal-mikrotik",
    title: "Mengenal MikroTik: RouterOS untuk Network Management",
    description:
      "Pengenalan MikroTik RouterOS — sistem operasi router yang powerful untuk manajemen jaringan.",
    date: "2026-05-08",
    category: "mikrotik",
    readingTime: "",
    featured: false,
    tags: ["mikrotik", "routeros", "winbox", "networking"],
    content: `MikroTik adalah perusahaan asal Latvia yang membuat perangkat keras dan perangkat lunak untuk jaringan. Produk utama mereka adalah RouterOS — sistem operasi berbasis Linux yang bisa mengubah PC biasa atau dedicated hardware menjadi router yang powerful.

## Kenapa MikroTik Populer?

MikroTik populer di kalangan ISP kecil-menengah, network administrator, dan bahkan home-lab enthusiast karena harganya yang terjangkau dengan fitur yang sangat lengkap.

## Fitur Utama RouterOS

1. **Routing** — Static, OSPF, BGP, MPLS
2. **Firewall & NAT** — Filter rules yang sangat granular
3. **VPN** — PPTP, L2TP, SSTP, OpenVPN, WireGuard
4. **QoS / Queue** — Bandwidth management, traffic shaping
5. **Hotspot** — Captive portal untuk public WiFi
6. **DHCP, DNS, NTP** — Network services built-in
7. **Wireless** — AP, bridge, WDS

## Cara Akses

Ada beberapa cara untuk mengakses dan mengelola RouterOS:

- **WinBox** — GUI tool resmi (Windows, bisa jalan via Wine di Linux)
- **WebFig** — Web interface
- **SSH** — CLI access
- **API** — Untuk automation dan integrasi

## Konfigurasi Dasar

\`\`\`
# Set identity
/system identity set name=MyRouter

# Set IP di interface
/ip address add address=192.168.1.1/24 interface=ether1

# Tambah NAT masquerade
/ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade

# Set DNS
/ip dns set servers=8.8.8.8,1.1.1.1

# DHCP server
/ip dhcp-server setup
\`\`\`

WinBox memudahkan kalau kamu belum familiar dengan CLI. Tapi lama-lama, CLI lebih cepat dan powerful.

## Best Practices

- **Backup konfigurasi** sebelum melakukan perubahan besar
- **Update RouterOS** secara berkala
- **Amankan access** — ganti default user, gunakan SSH key
- **Logging** — monitor traffic dan event penting
- **Firewall rules** — jangan cuma mengandalkan NAT

MikroTik bisa dipakai dari skala rumahan sampai ISP kelas menengah. Yang bikin beda adalah seberapa dalam kamu memahami fitur-fiturnya.`,
  },
  {
    slug: "dasar-pppoe",
    title: "Dasar PPPoE: Point-to-Point Protocol over Ethernet",
    description:
      "Memahami PPPoE, protokol yang banyak digunakan ISP untuk autentikasi dan manajemen pelanggan.",
    date: "2026-04-20",
    category: "networking",
    readingTime: "",
    featured: false,
    tags: ["pppoe", "isp", "mikrotik", "protokol"],
    content: `PPPoE (Point-to-Point Protocol over Ethernet) adalah protokol yang menggabungkan PPP (Point-to-Point Protocol) dengan Ethernet. PPPoE banyak digunakan oleh ISP untuk mengelola koneksi pelanggan — dari autentikasi sampai billing.

## Cara Kerja

PPPoE bekerja dengan membuat "session" PPP di atas jaringan Ethernet. Prosesnya:

1. **Discovery Stage** — Client mencari server PPPoE (Active Discovery Initiation / PADI)
2. **Offer** — Server merespons (PADO)
3. **Request** — Client memilih server dan request session (PADR)
4. **Confirmation** — Server konfirmasi session (PADS)
5. **Session Stage** — PPP negotiation (LCP, authentication, NCP)
6. **Data Transfer** — Data mulai mengalir

## Kenapa ISP Pakai PPPoE?

1. **Authentication** — Setiap user punya username dan password
2. **Accounting** — Bisa track usage per-user
3. **IP Assignment** — Dynamic IP assignment via IPCP
4. **Session Control** — ISP bisa terminate session kapan saja

## Konfigurasi di MikroTik

**Server side:**
\`\`\`
/interface pppoe-server server add service-name=pppoe interface=ether1
/ppp secret add name=user1 password=pass123 service=pppoe
\`\`\`

**Client side:**
\`\`\`
/interface pppoe-client add name=pppoe-out interface=ether1 user=user1 password=pass123
\`\`\`

## Kelebihan dan Kekurangan

Kelebihan:
- Authentication built-in
- Accounting built-in
- Support di hampir semua perangkat

Kekurangan:
- Overhead packet (8 byte PPPoE header)
- MTU lebih kecil (1492 vs 1500)
- Tidak se-simple DHCP

PPPoE mungkin udah termasuk teknologi lama, tapi masih jadi backbone banyak ISP di Indonesia. Paham cara kerjanya penting banget buat yang terjun ke networking.`,
  },
];

// Fill in computed reading times (kept in sync with content above).
for (const post of blogPosts) {
  post.readingTime = readingTimeOf(post.content);
}

export const allCategories = Object.keys(categoryMeta) as BlogCategory[];
