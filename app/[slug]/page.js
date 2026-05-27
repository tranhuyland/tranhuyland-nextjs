import { getGoogleSheetData } from '../utils';
import Link from 'next/next';

export async function generateStaticParams() {
  const data = await getGoogleSheetData();
  return data.map((item) => ({
    slug: item.slug || item.id.toString(),
  }));
}

export async function generateMetadata({ params }) {
  const data = await getGoogleSheetData();
  const item = data.find(i => i.slug === params.slug || i.id.toString() === params.slug);
  
  if (!item) return { title: 'Không tìm thấy sản phẩm | Trần Huy Land' };
  
  return {
    title: `${item.tieude} | Trần Huy Land`,
    description: `Giá bán: ${item.gia}. Diện tích: ${item.dienTich}. Vị trí: ${item.khuVucFull || item.khuVuc}. ${item.moTa?.substring(0, 120)}...`,
  };
}

export default async function PropertyDetail({ params }) {
  const data = await getGoogleSheetData();
  const item = data.find(i => i.slug === params.slug || i.id.toString() === params.slug);

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy thông tin nhà đất này.</h2>
        <a href="/" className="mt-4 inline-block bg-slate-900 text-white px-6 py-2 rounded-xl font-bold">Quay lại trang chính</a>
      </div>
    );
  }

  const danhSachAnh = item.anh ? item.anh.split(',').map(url => url.trim()) : [];

  return (
    <div className="max-w-3xl mx-auto w-full bg-white min-h-screen shadow-md flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <a href="/" className="text-slate-600 font-bold flex items-center gap-1 text-sm bg-slate-100 px-3 py-2 rounded-xl">
          ← Quay Lại Danh Sách
        </a>
        <strong className="text-slate-900 text-sm tracking-tight uppercase">Chi Tiết Tài Sản</strong>
        <div className="w-20"></div>
      </div>

      <div className="w-full aspect-[16/10] bg-slate-100 overflow-x-auto flex snap-x snap-mandatory no-scrollbar">
        {danhSachAnh.map((url, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 snap-start">
            <img src={url} alt={item.tieude} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div className="p-6 flex-1">
        <div className="flex items-center justify-between">
          <span className="bg-amber-100 text-amber-900 font-extrabold text-lg px-4 py-1.5 rounded-xl">{item.gia}</span>
          <span className="text-xs text-slate-500 font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">{item.phapLy || 'Sổ hồng chính chủ'}</span>
        </div>
        
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-4 leading-snug">{item.tieude}</h1>
        <p className="text-slate-500 text-sm font-semibold uppercase mt-2">📍 {item.khuVucFull || item.khuVuc}</p>

        <div className="grid grid-cols-3 gap-2 my-6 p-4 bg-slate-50 border border-slate-100 rounded-xl text-center font-semibold">
          <div><div className="text-slate-400 text-[11px] uppercase mb-0.5 tracking-wider">Diện tích</div><strong className="text-slate-900 text-sm sm:text-base">{item.dienTich || 'N/A'}</strong></div>
          <div><div className="text-slate-400 text-[11px] uppercase mb-0.5 tracking-wider">Cấu trúc</div><strong className="text-slate-900 text-sm sm:text-base">{item.phongNgu || 'Đất ở'}</strong></div>
          <div><div className="text-slate-400 text-[11px] uppercase mb-0.5 tracking-wider">Hướng</div><strong className="text-slate-900 text-sm sm:text-base">{item.huong || 'Chưa rõ'}</strong></div>
        </div>

        <h2 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">Thông tin mô tả thực tế nhà đất:</h2>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-justify whitespace-pre-line mb-10">{item.moTa}</p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex gap-3 z-50 max-w-3xl mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <a href="tel:0931555551" className="flex-1 bg-slate-900 text-white font-extrabold rounded-xl py-3 text-center text-sm">Gọi Thỏa Thuận</a>
        <a href="https://zalo.me/0931555551" target="_blank" className="flex-1 bg-[#0068ff] text-white font-extrabold rounded-xl py-3 text-center text-sm">Liên Hệ Zalo</a>
      </div>
    </div>
  );
}
