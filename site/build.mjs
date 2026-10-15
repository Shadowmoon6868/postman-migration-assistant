import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = resolve(root, 'site');
const output = resolve(root, '_site');
const repository = process.env.GITHUB_REPOSITORY || '';
const repoUrl = process.env.REPO_URL || (repository ? `https://github.com/${repository}` : 'https://github.com/');
const siteUrl = process.env.SITE_URL || (repository
  ? `https://${repository.split('/')[0]}.github.io/${repository.split('/')[1]}/`
  : 'http://localhost:4173/');
const canonical = new URL(siteUrl).href;

await mkdir(output, { recursive: true });
await cp(resolve(source, 'assets'), resolve(output, 'assets'), { recursive: true });
const template = await readFile(resolve(source, 'index.html'), 'utf8');
const faq = [
  ['Plugin này làm gì?', 'Postman Migration Assistant phân tích Postman Collection v2.0/v2.1 và xuất request cho IntelliJ HTTP Client cùng environment, script tương thích, source map và báo cáo những phần cần rà soát.'],
  ['Tôi có cần export collection v2.1 lại từ Postman không?', 'Không. Plugin nhận v2.0 hoặc v2.1; v2.0 được chuẩn hóa trong bộ nhớ và file gốc không bị sửa.'],
  ['Vì sao một số request phải chạy từ đầu file?', 'Request trong scenario.http có thể dùng token, ID hoặc biến do request trước tạo. Chạy chúng theo thứ tự. Request trong independent.http có thể chạy riêng hoặc song song.'],
  ['97,2% có nghĩa là 97,2% request chạy thành công?', 'Không. Đây là tỷ lệ chuyển đổi tĩnh của 2.510 trong 2.582 request thực thi thuộc 20 collection công khai. Cần kiểm thử runtime trên API đích để xác nhận hành vi.'],
  ['Dữ liệu collection có được tải lên máy chủ không?', 'Không trong luồng import. Phân tích và xuất file diễn ra cục bộ. Khi bạn tự chạy file .http, IntelliJ HTTP Client gửi request đến API mà bạn cấu hình.'],
  ['Plugin có hỗ trợ GraphQL, gRPC và WebSocket không?', 'Có điều kiện. GraphQL cần query; gRPC cần URL, service/method và message; WebSocket cần URL và message sequence. Thiếu dữ liệu cần thiết thì request được chỉ định rà soát thủ công.'],
  ['Hiện dùng trên IDE nào?', 'Technical preview được nhắm tới IntelliJ IDEA Ultimate 2025.3.2 (build IU-253.30387.90). Xem compatibility matrix để biết bằng chứng kiểm thử mới nhất. Chưa có công bố hỗ trợ rộng cho các phiên bản hoặc hệ điều hành khác.']
];
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': `${canonical}#website`, url: canonical, name: 'Postman Migration Assistant', inLanguage: 'vi-VN' },
    { '@type': 'SoftwareApplication', '@id': `${canonical}#software`, name: 'Postman Migration Assistant', url: canonical,
      applicationCategory: 'DeveloperApplication', operatingSystem: 'Windows',
      softwareVersion: '0.9.1 technical preview',
      description: 'Plugin chuyển Postman Collection v2.0/v2.1 thành bundle IntelliJ HTTP Client, môi trường và báo cáo phân tích.',
      requirements: 'IntelliJ IDEA Ultimate 2025.3.2 (IU-253.30387.90)', inLanguage: 'vi-VN' },
    { '@type': 'VideoObject', '@id': `${canonical}#demo`, name: 'Minh họa import Postman Collection vào IntelliJ HTTP Client',
      description: 'Video minh họa từ fixture CRUD kiểm thử: phân tích phụ thuộc và xuất scenario.http.',
      thumbnailUrl: `${canonical}assets/demo-poster.png`, contentUrl: `${canonical}assets/import-demo.mp4`,
      uploadDate: '2026-10-15T00:00:00+07:00', duration: 'PT18S', inLanguage: 'vi-VN' },
    { '@type': 'FAQPage', '@id': `${canonical}#faq`, mainEntity: faq.map(([name, answer]) => ({
      '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text: answer }
    })) }
  ]
};
const html = template.replaceAll('__SITE_URL__', canonical)
  .replaceAll('__REPO_URL__', repoUrl)
  .replace('__STRUCTURED_DATA__', JSON.stringify(structuredData).replaceAll('<', '\\u003c'));
await writeFile(resolve(output, 'index.html'), html);
await writeFile(resolve(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${canonical}sitemap.xml\n`);
await writeFile(resolve(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${canonical}</loc><lastmod>2026-10-15</lastmod></url></urlset>\n`);
await writeFile(resolve(output, 'llms.txt'), `# Postman Migration Assistant\n\n> Công cụ phân tích offline Postman Collection v2.0/v2.1 và xuất bundle IntelliJ HTTP Client. Bản technical preview nhắm IntelliJ IDEA Ultimate 2025.3.2.\n\n- Trang giới thiệu: ${canonical}\n- Hướng dẫn và liên hệ: ${repoUrl}/blob/main/README.md\n- Compatibility matrix: ${repoUrl}/blob/main/site/docs/COMPATIBILITY.md\n- Phương pháp đo corpus: ${repoUrl}/blob/main/site/docs/CORPUS-BENCHMARK.md\n- Fixture minh họa: ${repoUrl}/blob/main/site/qa/fixtures/crud.postman_collection.json\n- Liên hệ: shadowmoon6868@gmail.com\n\nSố 97,2% là chuyển đổi tĩnh, không chứng minh request chạy thành công.\n`);
await writeFile(resolve(output, '.nojekyll'), '');
console.log(`Built ${output} for ${canonical}`);
