# Compatibility và mức bằng chứng

Phiên bản 1.0 nhắm **IntelliJ IDEA Ultimate 2025.3.2,
IU-253.30387.90** trên Windows. Descriptor giới hạn build
`253.30387.*`. Chưa công bố hỗ trợ rộng cho phiên bản khác hoặc macOS/Linux.

| Khả năng | Trạng thái | Ghi chú |
|---|---|---|
| Collection v2.0/v2.1 | Kiểm thử converter | v2.0 được chuẩn hóa trong bộ nhớ, không sửa nguồn |
| Request độc lập / chuỗi phụ thuộc | Kiểm thử converter | Tách `independent.http` và `scenario.http` khi phân tích được |
| Environment và globals | Kiểm thử converter | Giá trị riêng tư xuất vào private environment |
| JavaScript `pm.*` phổ biến | Kiểm thử converter | Phần ngoài allowlist bị cô lập |
| OAuth2 | Sinh cấu hình, runtime chưa xác nhận chung | Một số flow được ánh xạ; cấu hình thiếu hoặc mâu thuẫn bị chặn |
| GraphQL | Kiểm thử converter | Cần query |
| gRPC | Kiểm thử converter | Cần URL, service/method và message |
| WebSocket | Kiểm thử converter | Cần URL và message |
| Newman / IntelliJ trace adapters | Kiểm thử adapter | Phục vụ differential report |
| Tương đương runtime trên API của người dùng | **NOT_RUN** | Cần chạy và so sánh sau import |
| Native UI automation đầy đủ | **NOT_RUN** | Không được suy ra từ build hoặc plugin verification |
| macOS / Linux | Chưa có bằng chứng runtime | Không công bố compatibility |

Plugin Verifier đã kiểm tra artifact 1.0.0 cho target IU-253.30387.90 và báo `Compatible`.
Bằng chứng này chỉ xác nhận mức API compatibility của target; nó không chứng
minh mọi dialog hoặc request đã hoạt động ở runtime. Với request bị cô lập,
report chỉ rõ nguồn để người dùng sửa thủ công.
