# Phương pháp đo độ phủ chuyển đổi

Bộ đo ngày 2026-10-12 kiểm tra khả năng **chuyển đổi tĩnh** của phiên bản 0.9.0.
Nó không gửi request đến API và không chứng minh hành vi runtime tương đương Postman.
Mọi bundle người dùng sinh ra đều ở trạng thái `NOT_RUN` cho đến khi được chạy và
đối chiếu trên dịch vụ đích.

Hai nhóm, mỗi nhóm 10 Postman collection công khai, có tổng cộng 2.582 request
thực thi. Converter đánh dấu 2.510 request có thể chuyển (97,2%); 72 request
được đưa vào diện cần rà soát. 22 mục chỉ chứa ví dụ tài liệu được thống kê
riêng, không đưa vào mẫu số request thực thi.

| Nhóm | Request thực thi | Chuyển được | Tỷ lệ |
|---|---:|---:|---:|
| Nhóm ban đầu | 914 | 883 | 96,6% |
| Nhóm mở rộng | 1.668 | 1.627 | 97,5% |
| **Tổng** | **2.582** | **2.510** | **97,2%** |

Các collection bao gồm Postman Echo, GitHub API, PayPal Partner, WhatsApp
Cloud, Notion, Twilio SMS, Salesforce Marketing Cloud, Stripe, HubSpot
GraphQL, Slack Web API, Microsoft Graph, Zoom GraphQL, Dropbox, MongoDB
Data API, Pipedrive, Razorpay, Shopify Admin REST, Google Maps và Docusign.

Đơn vị đếm là một request thực thi trong collection, không phải một lệnh
assertion hoặc một lượt chạy. Converter nhận collection v2.0/v2.1; v2.0 được
chuẩn hóa trong bộ nhớ. Một request chỉ được tính chuyển được nếu emitter có
đủ cấu trúc để sinh cú pháp đích và các kiểm tra semantics tĩnh không phát
hiện blocker. Các trường hợp còn lại vẫn hiện trong report/manual review.

Các blocker cố ý bao gồm URL rỗng, OAuth2 thiếu cấu hình, thay đổi URL/method
động, `pm.execution.setNextRequest`, visualizer, package ngoài, body file
không có sẵn, cookie-jar semantics và một số system-header override. Kết quả
runtime có thể thấp hơn tỷ lệ trên do khác biệt API, credentials, môi trường
hoặc hành vi client.
