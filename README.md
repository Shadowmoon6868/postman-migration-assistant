# Postman Migration Assistant

Trang giới thiệu và demo cho plugin chuyển Postman Collection v2.0/v2.1
sang IntelliJ HTTP Client. Xem website tại
[shadowmoon6868.github.io/postman-migration-assistant](https://shadowmoon6868.github.io/postman-migration-assistant/).

Plugin phân tích collection offline, đọc environment/globals, chỉ rõ request
phụ thuộc và xuất `scenario.http`, `independent.http`, các file environment,
compatibility script và migration report. Request không có ánh xạ an toàn
được đưa vào manual review. Technical preview hiện nhắm IntelliJ IDEA
Ultimate 2025.3.2; xem [compatibility matrix](site/docs/COMPATIBILITY.md).

## Video và ví dụ

Website có video minh họa 18 giây, phụ đề tiếng Việt, lời dẫn dạng văn bản
và ví dụ trước/sau import dựa trên
[fixture CRUD](site/qa/fixtures/crud.postman_collection.json).
Video được dựng từ fixture; không phải bằng chứng chạy giao diện IntelliJ.

Con số 97,2% là độ phủ chuyển đổi **tĩnh** trên 20 collection công khai,
không phải tỷ lệ request chạy thành công. Xem
[phương pháp đo](site/docs/CORPUS-BENCHMARK.md).

## Nhận bản beta

Liên hệ [shadowmoon6868@gmail.com](mailto:shadowmoon6868@gmail.com?subject=Postman%20Migration%20Assistant%20beta).
Không gửi token, secret hoặc dữ liệu khách hàng qua email.

## Cập nhật website

Source ở `site/`; workflow `.github/workflows/pages.yml` build bằng Node.js
không cần npm package và deploy qua GitHub Pages. Sau khi clone:

```bash
SITE_URL=http://localhost:4173/ REPO_URL=https://github.com/Shadowmoon6868/postman-migration-assistant node site/build.mjs
node site/test.mjs
python -m http.server 4173 --directory _site
```

Thiết kế dùng CSS tĩnh, font hệ thống và không có script theo dõi. Sitemap,
robots, metadata Open Graph, JSON-LD và `llms.txt` được tạo khi build.

Postman Migration Assistant là công cụ độc lập, không liên kết hoặc được
chứng nhận bởi Postman hay JetBrains.
