# Sanad Youth Backend

## 1. نبذة عن المشروع (Project Overview)

Sanad Youth هو نظام Backend يهدف إلى إدارة البرامج والأنشطة الشبابية، وتنظيم عملية التقديم عليها، وإدارة المستخدمين والمشرفين والإعلانات والمواد التعليمية.

تم تطوير المشروع لتوفير واجهات API تساعد على إدارة العمليات المختلفة والتعامل مع قاعدة البيانات بطريقة منظمة وآمنة.

## 2. التقنيات المستخدمة (Technologies Used)

* **NestJS:** إطار عمل لتطوير Backend.
* **TypeScript:** لغة البرمجة المستخدمة.
* **PostgreSQL:** نظام إدارة قاعدة البيانات.
* **Prisma ORM:** للتعامل مع قاعدة البيانات.
* **JWT:** للمصادقة والتحقق من هوية المستخدم.
* **Bcrypt:** لتجزئة كلمات المرور.
* **Helmet:** لتعزيز أمان HTTP.
* **ValidationPipe:** للتحقق من صحة البيانات المدخلة.
* **Throttler:** لتحديد معدل الطلبات.

## 3. الوظائف الرئيسية (Main Features)

### Authentication

* تسجيل حساب جديد.
* تسجيل الدخول.
* المصادقة باستخدام JWT.

### Users and Roles

إدارة المستخدمين حسب الأدوار:

* Youth
* Supervisor
* Admin

### Programs

* إنشاء البرامج.
* عرض البرامج.
* تعديل البرامج.
* إدارة البرامج الخاصة بالمشرف.

### Sessions

إضافة وإدارة الجلسات المرتبطة بالبرامج.

### Applications

* التقديم على البرامج.
* عرض طلبات التقديم.
* إلغاء الطلب.
* مراجعة الطلبات وتحديث حالتها.

### Announcements

* إنشاء الإعلانات.
* عرض الإعلانات العامة والخاصة بالبرامج.

### File Uploads

* رفع السيرة الذاتية (CV).
* رفع صور البرامج.
* رفع المواد التعليمية.
* الوصول إلى المواد المرفوعة.

### Admin Operations

إنشاء حسابات المشرفين.

## 4. قاعدة البيانات (Database)

يستخدم المشروع PostgreSQL مع Prisma ORM.

الجداول الرئيسية:

| Table        | Description       |
| ------------ | ----------------- |
| User         | بيانات المستخدمين |
| Program      | بيانات البرامج    |
| Session      | جلسات البرامج     |
| Application  | طلبات التقديم     |
| Announcement | الإعلانات         |
| Material     | المواد التعليمية  |

يمكن الاطلاع على مخطط قاعدة البيانات داخل:

`docs/ERD.mmd`

## 5. متطلبات التشغيل (Requirements)

لتشغيل المشروع تحتاج إلى:

* Node.js
* npm
* PostgreSQL
* Git

## 6. تثبيت المشروع (Installation)

استنسخ المشروع:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

انتقل إلى مجلد المشروع:

```bash
cd sanad-youth-backend
```

ثبّت الحزم:

```bash
npm install
```

## 7. إعداد متغيرات البيئة (Environment Variables)

أنشئ ملف `.env` في المجلد الرئيسي للمشروع، وأضف إعدادات الاتصال بقاعدة البيانات ومفتاح JWT وفقاً لما يتطلبه الكود.

لا ترفع ملف `.env` إلى GitHub لأنه قد يحتوي على معلومات سرية.

## 8. إعداد قاعدة البيانات (Database Setup)

بعد التأكد من إعداد اتصال PostgreSQL، نفّذ:

```bash
npx prisma generate
```

ثم شغّل migrations الموجودة في المشروع حسب إعدادات Prisma:

```bash
npx prisma migrate dev
```

## 9. تشغيل المشروع (Running the Application)

لتشغيل المشروع في وضع التطوير:

```bash
npm run start:dev
```

عنوان API المحلي:

`http://localhost:3000/api`

## 10. API Endpoints

| Method | Endpoint                                  | Description        |
| ------ | ----------------------------------------- | ------------------ |
| POST   | /api/auth/register                        | تسجيل مستخدم جديد  |
| POST   | /api/auth/login                           | تسجيل الدخول       |
| GET    | /api/programs                             | عرض البرامج        |
| GET    | /api/programs/manage/mine                 | عرض برامج المشرف   |
| GET    | /api/programs/:id                         | عرض برنامج محدد    |
| POST   | /api/programs                             | إنشاء برنامج       |
| PATCH  | /api/programs/:id                         | تعديل برنامج       |
| POST   | /api/programs/:id/sessions                | إضافة جلسة         |
| GET    | /api/applications/mine                    | عرض طلباتي         |
| POST   | /api/applications/:programId              | التقديم على برنامج |
| PATCH  | /api/applications/:id/cancel              | إلغاء طلب          |
| GET    | /api/applications                         | عرض الطلبات        |
| PATCH  | /api/applications/:id/review              | مراجعة طلب         |
| GET    | /api/announcements                        | عرض الإعلانات      |
| POST   | /api/announcements                        | إنشاء إعلان        |
| POST   | /api/uploads/cv/:applicationId            | رفع السيرة الذاتية |
| POST   | /api/uploads/program/:programId/image     | رفع صورة برنامج    |
| POST   | /api/uploads/program/:programId/materials | رفع مواد البرنامج  |
| GET    | /api/uploads/materials/:id                | الوصول إلى مادة    |
| POST   | /api/admin/supervisors                    | إنشاء مشرف         |

## 11. الأمان (Security)

يتضمن المشروع آليات أمنية مثل:

* JWT Authentication.
* Password Hashing باستخدام Bcrypt.
* Role-Based Access Control.
* ValidationPipe للتحقق من البيانات.
* Helmet لتعزيز أمان HTTP.

## 12. مخطط المشروع (Project Documentation)

يتضمن مجلد `docs` ملفات توثيق المشروع:

* `ERD.mmd`: مخطط قاعدة البيانات والعلاقات بين الجداول.
* `REVIEW.md`: تقرير مراجعة المشروع والملاحظات التقنية.

## 13. حالة المشروع (Project Status)

تم تطوير الوحدات الأساسية للـ Backend، مع إجراء فحوصات أساسية للبناء وبعض واجهات API.

لا تزال هناك حاجة إلى اختبارات شاملة والتحقق من جاهزية المشروع للنشر في بيئة الإنتاج.

---

**Project Name:** Sanad Youth Backend

**Backend Framework:** NestJS

**Database:** PostgreSQL

**ORM:** Prisma
