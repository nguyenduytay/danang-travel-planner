const fs = require('fs');
const path = require('path');

// Target paths
const scheduleCsvPath = path.join(__dirname, '..', 'schedule.csv');
const eventsCsvPath = path.join(__dirname, '..', 'events.csv');
const dataJsPath = path.join(__dirname, 'data.js');

// Helper to escape CSV values
function escapeCSV(val) {
    if (val === null || val === undefined) return '';
    let str = val.toString();
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        str = str.replace(/"/g, '""');
        return `"${str}"`;
    }
    return str;
}

// 1. Define Itinerary Data
const ITINERARY = [
    // Day 1: 25/06/2026
    {
        date: "25/06/2026",
        time_slot: "Sáng",
        stop_order: 1,
        location_name: "Sân bay Quốc tế Đà Nẵng",
        category: "Di chuyển",
        address: "Nguyễn Văn Linh, Hòa Thuận Tây, Hải Châu, Đà Nẵng",
        start_time: "08:00",
        end_time: "08:30",
        duration_minutes: 30,
        cost_estimate: 0,
        rating: 4.4,
        tiktok_popularity: "Trung bình",
        distance_to_next: "1.5 km (5 phút di chuyển)",
        reason: "Điểm khởi đầu chuyến hành trình Đà Nẵng, làm thủ tục nhận hành lý và di chuyển vào trung tâm.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Sân+bay+Quốc+tế+Đà+Nẵng"
    },
    {
        date: "25/06/2026",
        time_slot: "Sáng",
        stop_order: 2,
        location_name: "Trình Cà Phê",
        category: "Cafe",
        address: "34/4 Nguyễn Hữu Thọ, Hòa Thuận Tây, Hải Châu, Đà Nẵng",
        start_time: "08:30",
        end_time: "09:30",
        duration_minutes: 60,
        cost_estimate: 30000,
        rating: 4.6,
        tiktok_popularity: "Rất cao",
        distance_to_next: "2.2 km (7 phút di chuyển)",
        reason: "Quán cafe phong cách vườn mộc mạc, nhiều mảng xanh, cực kỳ chill để thư giãn sau chuyến bay.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Trình+Cà+Phê+Nguyễn+Hữu+Thọ+Đà+Nẵng"
    },
    {
        date: "25/06/2026",
        time_slot: "Sáng",
        stop_order: 3,
        location_name: "Bảo tàng Điêu khắc Chăm Đà Nẵng",
        category: "Du lịch",
        address: "Số 2 đường 2 Tháng 9, Bình Hiên, Hải Châu, Đà Nẵng",
        start_time: "09:30",
        end_time: "11:00",
        duration_minutes: 90,
        cost_estimate: 60000,
        rating: 4.5,
        tiktok_popularity: "Trung bình",
        distance_to_next: "0.8 km (3 phút di chuyển)",
        reason: "Tìm hiểu văn hóa Chăm Pa cổ xưa với bộ sưu tập hiện vật điêu khắc đá độc bản lớn nhất thế giới.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Bảo+tàng+Chăm+Đà+Nẵng"
    },
    {
        date: "25/06/2026",
        time_slot: "Trưa",
        stop_order: 4,
        location_name: "Mì Quảng Bà Mua",
        category: "Ăn uống",
        address: "19-21 Trần Bình Trọng, Phước Ninh, Hải Châu, Đà Nẵng",
        start_time: "11:00",
        end_time: "12:00",
        duration_minutes: 60,
        cost_estimate: 50000,
        rating: 4.5,
        tiktok_popularity: "Rất cao",
        distance_to_next: "0.3 km (1 phút đi bộ)",
        reason: "Thương hiệu mì Quảng trứ danh, nước dùng ngọt đậm đà, thịt heo và tôm tươi ngon chuẩn vị.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Mì+Quảng+Bà+Mua+Trần+Bình+Trọng"
    },
    {
        date: "25/06/2026",
        time_slot: "Trưa",
        stop_order: 5,
        location_name: "Nhà thờ Con Gà (Chính Tòa Đà Nẵng)",
        category: "Check-in",
        address: "156 Trần Phú, Hải Châu 1, Hải Châu, Đà Nẵng",
        start_time: "12:00",
        end_time: "13:00",
        duration_minutes: 60,
        cost_estimate: 0,
        rating: 4.5,
        tiktok_popularity: "Cao",
        distance_to_next: "0.4 km (2 phút đi bộ)",
        reason: "Nhà thờ kiến trúc Gothic cổ kính sơn màu hồng pastel duy nhất từ thời Pháp, điểm check-in sống ảo cực đẹp.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Nhà+thờ+Con+Gà+Đà+Nẵng"
    },
    {
        date: "25/06/2026",
        time_slot: "Trưa",
        stop_order: 6,
        location_name: "Namto House Coffee",
        category: "Cafe",
        address: "130 Nguyễn Chí Thanh, Hải Châu 1, Hải Châu, Đà Nẵng",
        start_time: "13:00",
        end_time: "14:00",
        duration_minutes: 60,
        cost_estimate: 45000,
        rating: 4.6,
        tiktok_popularity: "Rất cao",
        distance_to_next: "9 km (15 phút di chuyển)",
        reason: "Không gian tone màu gỗ ấm cúng phong cách Hàn Quốc siêu tinh tế, đồ uống ngọt mát nghỉ trưa dễ chịu.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Namto+House+Coffee+130+Nguyễn+Chí+Thanh"
    },
    {
        date: "25/06/2026",
        time_slot: "Chiều",
        stop_order: 7,
        location_name: "Danh thắng Ngũ Hành Sơn",
        category: "Du lịch",
        address: "81 Huyền Trân Công Chúa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng",
        start_time: "14:00",
        end_time: "16:30",
        duration_minutes: 150,
        cost_estimate: 60000,
        rating: 4.5,
        tiktok_popularity: "Cao",
        distance_to_next: "7.5 km (12 phút di chuyển)",
        reason: "Khám phá hang động kỳ bí (Động Huyền Không, Tàng Chơn) và viếng chùa Linh Ứng cổ kính giữa núi đá vôi.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Ngũ+Hành+Sơn+Đà+Nẵng"
    },
    {
        date: "25/06/2026",
        time_slot: "Chiều",
        stop_order: 8,
        location_name: "Bãi biển Mỹ Khê",
        category: "Check-in",
        address: "Đường Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng",
        start_time: "16:30",
        end_time: "18:00",
        duration_minutes: 90,
        cost_estimate: 0,
        rating: 4.6,
        tiktok_popularity: "Rất cao",
        distance_to_next: "1.2 km (3 phút di chuyển)",
        reason: "Tắm biển mát lạnh, đi dạo trên bờ cát trắng mịn màng của một trong những bãi biển đẹp nhất hành tinh.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Biển+Mỹ+Khê+Đà+Nẵng"
    },
    {
        date: "25/06/2026",
        time_slot: "Tối",
        stop_order: 9,
        location_name: "Hải sản Mộc Quán",
        category: "Ăn uống",
        address: "26 Tô Hiến Thành, Phước Mỹ, Sơn Trà, Đà Nẵng",
        start_time: "18:00",
        end_time: "19:30",
        duration_minutes: 90,
        cost_estimate: 250000,
        rating: 4.6,
        tiktok_popularity: "Rất cao",
        distance_to_next: "2.5 km (5 phút di chuyển)",
        reason: "Thưởng thức hải sản tươi rói bắt tại bể, không gian quán mộc mạc và chế biến đậm đà nổi tiếng TikTok.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Hải+sản+Mộc+Quán+Đà+Nẵng"
    },
    {
        date: "25/06/2026",
        time_slot: "Tối",
        stop_order: 10,
        location_name: "Cầu Tình Yêu & Tượng Cá Chép Hóa Rồng",
        category: "Check-in",
        address: "Đường Trần Hưng Đạo, An Hải Tây, Sơn Trà, Đà Nẵng",
        start_time: "19:30",
        end_time: "21:00",
        duration_minutes: 90,
        cost_estimate: 0,
        rating: 4.6,
        tiktok_popularity: "Rất cao",
        distance_to_next: "0.1 km (1 phút đi bộ)",
        reason: "Đi dạo ngắm sông Hàn thơ mộng lung linh ánh đèn, check-in cây cầu tình yêu khóa lãng mạn.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Cầu+Tình+Yêu+Đà+Nẵng"
    },
    {
        date: "25/06/2026",
        time_slot: "Tối",
        stop_order: 11,
        location_name: "Chợ đêm Sơn Trà",
        category: "Vui chơi",
        address: "Đường Trần Hưng Đạo, An Hải Tây, Sơn Trà, Đà Nẵng",
        start_time: "21:00",
        end_time: "22:30",
        duration_minutes: 90,
        cost_estimate: 50000,
        rating: 4.4,
        tiktok_popularity: "Cao",
        distance_to_next: "2.1 km (5 phút di chuyển)",
        reason: "Mua sắm quà lưu niệm và ăn vặt tại khu chợ đêm nhộn nhịp ngay chân Cầu Rồng.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Chợ+đêm+Sơn+Trà"
    },
    {
        date: "25/06/2026",
        time_slot: "Tối",
        stop_order: 12,
        location_name: "On The Radio Bar",
        category: "Vui chơi",
        address: "76 Thái Phiên, Phước Ninh, Hải Châu, Đà Nẵng",
        start_time: "22:30",
        end_time: "23:30",
        duration_minutes: 60,
        cost_estimate: 100000,
        rating: 4.6,
        tiktok_popularity: "Rất cao",
        distance_to_next: "1.5 km (5 phút về khách sạn)",
        reason: "Nghe ban nhạc live-music biểu diễn cực chất các bản hit acoustic và rock cuốn hút.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=On+The+Radio+Bar+Đà+Nẵng"
    },

    // Day 2: 26/06/2026
    {
        date: "26/06/2026",
        time_slot: "Sáng",
        stop_order: 1,
        location_name: "Bún chả cá Ông Tạ",
        category: "Ăn uống",
        address: "113A Nguyễn Chí Thanh, Hải Châu 1, Hải Châu, Đà Nẵng",
        start_time: "07:00",
        end_time: "08:00",
        duration_minutes: 60,
        cost_estimate: 45000,
        rating: 4.5,
        tiktok_popularity: "Cao",
        distance_to_next: "26 km (45 phút di chuyển)",
        reason: "Bắt đầu ngày mới với bát bún chả cá thu thơm ngon, ngọt thanh từ rau củ hầm chuẩn vị Đà Nẵng.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Bún+chả+cá+Ông+Tạ+Đà+Nẵng"
    },
    {
        date: "26/06/2026",
        time_slot: "Sáng",
        stop_order: 2,
        location_name: "Di chuyển lên Sun World Ba Na Hills",
        category: "Di chuyển",
        address: "An Sơn, Hòa Ninh, Hòa Vang, Đà Nẵng",
        start_time: "08:00",
        end_time: "09:00",
        duration_minutes: 60,
        cost_estimate: 150000,
        rating: 4.6,
        tiktok_popularity: "Trung bình",
        distance_to_next: "0 km (tại điểm đến)",
        reason: "Di chuyển bằng taxi/xe trung chuyển lên ga cáp treo Bà Nà Hills.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Sun+World+Ba+Na+Hills"
    },
    {
        date: "26/06/2026",
        time_slot: "Sáng",
        stop_order: 3,
        location_name: "Cáp treo & Check-in Cầu Vàng",
        category: "Check-in",
        address: "Sun World Ba Na Hills, Hòa Vang, Đà Nẵng",
        start_time: "09:00",
        end_time: "11:30",
        duration_minutes: 150,
        cost_estimate: 950000,
        rating: 4.7,
        tiktok_popularity: "Cực cao",
        distance_to_next: "0 km (trong khu du lịch)",
        reason: "Trải nghiệm cáp treo ngắm núi rừng xanh ngát và check-in Cầu Vàng nâng đỡ bởi bàn tay khổng lồ huyền thoại.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Sun+World+Ba+Na+Hills"
    },
    {
        date: "26/06/2026",
        time_slot: "Trưa",
        stop_order: 4,
        location_name: "Buffet trưa tại Arapang / Beer Plaza",
        category: "Ăn uống",
        address: "Khu ẩm thực Sun World Ba Na Hills, Hòa Vang, Đà Nẵng",
        start_time: "11:30",
        end_time: "13:00",
        duration_minutes: 90,
        cost_estimate: 350000,
        rating: 4.5,
        tiktok_popularity: "Cao",
        distance_to_next: "0 km (trong khu du lịch)",
        reason: "Thưởng thức ẩm thực buffet phong phú đa dạng quốc tế ngay trên đỉnh núi Bà Nà mát mẻ.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Sun+World+Ba+Na+Hills"
    },
    {
        date: "26/06/2026",
        time_slot: "Trưa",
        stop_order: 5,
        location_name: "Check-in Làng Pháp cổ kính",
        category: "Check-in",
        address: "Sun World Ba Na Hills, Hòa Vang, Đà Nẵng",
        start_time: "13:00",
        end_time: "14:00",
        duration_minutes: 60,
        cost_estimate: 0,
        rating: 4.6,
        tiktok_popularity: "Rất cao",
        distance_to_next: "0 km (trong khu du lịch)",
        reason: "Chụp ảnh cùng lâu đài mang kiến trúc châu Âu Gothic trung cổ lãng mạn phủ sương mù tuyệt đẹp.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Sun+World+Ba+Na+Hills"
    },
    {
        date: "26/06/2026",
        time_slot: "Chiều",
        stop_order: 6,
        location_name: "Khu vui chơi Fantasy Park",
        category: "Vui chơi",
        address: "Sun World Ba Na Hills, Hòa Vang, Đà Nẵng",
        start_time: "14:00",
        end_time: "15:30",
        duration_minutes: 90,
        cost_estimate: 0,
        rating: 4.5,
        tiktok_popularity: "Cao",
        distance_to_next: "0.1 km (1 phút đi bộ)",
        reason: "Trải nghiệm khu vui chơi trong nhà khổng lồ với các trò chơi mạo hiểm cảm giác mạnh lý thú.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Sun+World+Ba+Na+Hills"
    },
    {
        date: "26/06/2026",
        time_slot: "Chiều",
        stop_order: 7,
        location_name: "Trượt máng Alpine Coaster",
        category: "Vui chơi",
        address: "Sun World Ba Na Hills, Hòa Vang, Đà Nẵng",
        start_time: "15:30",
        end_time: "17:00",
        duration_minutes: 90,
        cost_estimate: 70000,
        rating: 4.6,
        tiktok_popularity: "Rất cao",
        distance_to_next: "22 km (38 phút di chuyển)",
        reason: "Trải nghiệm cảm giác lướt gió tốc độ cao xuyên rừng bằng xe trượt máng mạo hiểm hấp dẫn.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Sun+World+Ba+Na+Hills"
    },
    {
        date: "26/06/2026",
        time_slot: "Chiều",
        stop_order: 8,
        location_name: "Di chuyển về trung tâm thành phố",
        category: "Di chuyển",
        address: "35 Đỗ Thúc Tịnh, Cẩm Lệ, Đà Nẵng",
        start_time: "17:00",
        end_time: "18:00",
        duration_minutes: 60,
        cost_estimate: 150000,
        rating: 4.5,
        tiktok_popularity: "Trung bình",
        distance_to_next: "0 km (tại điểm ăn tối)",
        reason: "Xuống cáp treo và đón xe di chuyển về trung tâm thành phố ăn tối đặc sản.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Bánh+tráng+thịt+heo+Quán+Mậu+Đà+Nẵng"
    },
    {
        date: "26/06/2026",
        time_slot: "Tối",
        stop_order: 9,
        location_name: "Bánh tráng cuốn thịt heo Quán Mậu",
        category: "Ăn uống",
        address: "35 Đỗ Thúc Tịnh, Khuê Trung, Cẩm Lệ, Đà Nẵng",
        start_time: "18:00",
        end_time: "19:30",
        duration_minutes: 90,
        cost_estimate: 80000,
        rating: 4.5,
        tiktok_popularity: "Rất cao",
        distance_to_next: "6 km (12 phút di chuyển)",
        reason: "Món bánh tráng cuốn thịt heo hai đầu da chuẩn vị kèm mắm nêm bí truyền sánh đặc nồng nàn.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Bánh+tráng+thịt+heo+Quán+Mậu+Đà+Nẵng"
    },
    {
        date: "26/06/2026",
        time_slot: "Tối",
        stop_order: 10,
        location_name: "Chè Liên Hoàng Diệu",
        category: "Ăn uống",
        address: "189 Hoàng Diệu, Hải Châu, Đà Nẵng",
        start_time: "19:30",
        end_time: "20:30",
        duration_minutes: 60,
        cost_estimate: 30000,
        rating: 4.5,
        tiktok_popularity: "Rất cao",
        distance_to_next: "2.5 km (6 phút di chuyển)",
        reason: "Thưởng thức món chè sầu Liên béo ngậy nước cốt dừa nức tiếng gần xa làm món tráng miệng ngọt ngào.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Chè+Liên+Hoàng+Diệu+Đà+Nẵng"
    },
    {
        date: "26/06/2026",
        time_slot: "Tối",
        stop_order: 11,
        location_name: "Chợ đêm Helio",
        category: "Vui chơi",
        address: "Đường 2 tháng 9, Hòa Cường Bắc, Hải Châu, Đà Nẵng",
        start_time: "20:30",
        end_time: "22:00",
        duration_minutes: 90,
        cost_estimate: 50000,
        rating: 4.5,
        tiktok_popularity: "Rất cao",
        distance_to_next: "0.5 km (2 phút đi bộ)",
        reason: "Hòa mình vào thiên đường ẩm thực đường phố sôi động và thưởng thức các buổi nhạc live acoustic ngoài trời cực vui.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Chợ+đêm+Helio"
    },
    {
        date: "26/06/2026",
        time_slot: "Tối",
        stop_order: 12,
        location_name: "Vòng quay mặt trời Sun Wheel (Asia Park)",
        category: "Vui chơi",
        address: "1 Phan Đăng Lưu, Hòa Cường Bắc, Hải Châu, Đà Nẵng",
        start_time: "22:00",
        end_time: "23:00",
        duration_minutes: 60,
        cost_estimate: 100000,
        rating: 4.5,
        tiktok_popularity: "Cao",
        distance_to_next: "3 km (8 phút về khách sạn)",
        reason: "Trải nghiệm vòng quay khổng lồ ngắm nhìn toàn bộ thành phố Đà Nẵng lung linh huyền ảo về đêm từ độ cao 115m.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Công+viên+Châu+Á"
    },

    // Day 3: 27/06/2026
    {
        date: "27/06/2026",
        time_slot: "Sáng",
        stop_order: 1,
        location_name: "Bán đảo Sơn Trà & Đỉnh Bàn Cờ (Ngắm bình minh)",
        category: "Check-in",
        address: "Thọ Quang, Sơn Trà, Đà Nẵng",
        start_time: "06:00",
        end_time: "07:00",
        duration_minutes: 60,
        cost_estimate: 0,
        rating: 4.6,
        tiktok_popularity: "Cao",
        distance_to_next: "9.5 km (16 phút di chuyển)",
        reason: "Đón những tia nắng bình minh đầu tiên của ngày mới tại đỉnh núi cao nhất Sơn Trà gắn liền truyền thuyết Đế Thích.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Đỉnh+Bàn+Cờ"
    },
    {
        date: "27/06/2026",
        time_slot: "Sáng",
        stop_order: 2,
        location_name: "Bún chả cá Hờn",
        category: "Ăn uống",
        address: "139/5 Hùng Vương, Hải Châu 2, Hải Châu, Đà Nẵng",
        start_time: "07:00",
        end_time: "08:00",
        duration_minutes: 60,
        cost_estimate: 35000,
        rating: 4.5,
        tiktok_popularity: "Cao",
        distance_to_next: "0.6 km (2 phút di chuyển)",
        reason: "Thưởng thức bát bún cá thu dai ngọt thơm ngon với giá cả bình dân được giới học sinh sinh viên rất mê.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Bún+chả+cá+Hờn+Đà+Nẵng"
    },
    {
        date: "27/06/2026",
        time_slot: "Sáng",
        stop_order: 3,
        location_name: "Ikigai Garden Cafe",
        category: "Cafe",
        address: "60 Nguyễn Chí Thanh, Hải Châu 1, Hải Châu, Đà Nẵng",
        start_time: "08:00",
        end_time: "09:30",
        duration_minutes: 90,
        cost_estimate: 40000,
        rating: 4.5,
        tiktok_popularity: "Cao",
        distance_to_next: "9.5 km (16 phút di chuyển)",
        reason: "Quán cafe phong cách sân vườn Nhật Bản tinh tế, không gian gỗ thanh bình thưởng thức trà matcha rất ngon.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Ikigai+Garden+Cafe+Nguyễn+Chí+Thanh"
    },
    {
        date: "27/06/2026",
        time_slot: "Sáng",
        stop_order: 4,
        location_name: "Chùa Linh Ứng Bãi Bụt",
        category: "Du lịch",
        address: "Bán đảo Sơn Trà, Thọ Quang, Sơn Trà, Đà Nẵng",
        start_time: "09:30",
        end_time: "11:30",
        duration_minutes: 120,
        cost_estimate: 0,
        rating: 4.8,
        tiktok_popularity: "Rất cao",
        distance_to_next: "6.5 km (12 phút di chuyển)",
        reason: "Chiêm bái tượng Phật Quan Thế Âm cao nhất Việt Nam (67m) hướng ra biển xanh mênh mông cầu bình an.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Chùa+Linh+Ứng+Sơn+Trà"
    },
    {
        date: "27/06/2026",
        time_slot: "Trưa",
        stop_order: 5,
        location_name: "Hải sản Năm Đảnh",
        category: "Ăn uống",
        address: "K139/H59/38 Trần Quang Khải, Thọ Quang, Sơn Trà, Đà Nẵng",
        start_time: "11:30",
        end_time: "13:00",
        duration_minutes: 90,
        cost_estimate: 150000,
        rating: 4.5,
        tiktok_popularity: "Rất cao",
        distance_to_next: "7 km (14 phút di chuyển)",
        reason: "Quán hải sản hẻm siêu hot TikTok nức tiếng Đà Nẵng về độ tươi ngon, đa dạng món ăn và giá cực kỳ rẻ.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Hải+sản+Năm+Đảnh"
    },
    {
        date: "27/06/2026",
        time_slot: "Trưa",
        stop_order: 6,
        location_name: "Boulevard Gelato & Coffee",
        category: "Cafe",
        address: "77 Trần Quốc Toản, Hải Châu 1, Hải Châu, Đà Nẵng",
        start_time: "13:00",
        end_time: "14:00",
        duration_minutes: 60,
        cost_estimate: 50000,
        rating: 4.5,
        tiktok_popularity: "Rất cao",
        distance_to_next: "0.8 km (3 phút di chuyển)",
        reason: "Quán kem và cafe mang vibe châu Âu lãng mạn, các vị kem gelato ngọt dịu mịn màng giải nhiệt ngày hè cực đỉnh.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Boulevard+Gelato+Coffee+Đà+Nẵng"
    },
    {
        date: "27/06/2026",
        time_slot: "Chiều",
        stop_order: 7,
        location_name: "Công viên APEC",
        category: "Check-in",
        address: "Đường 2 Tháng 9, Bình Hiên, Hải Châu, Đà Nẵng",
        start_time: "14:00",
        end_time: "16:00",
        duration_minutes: 120,
        cost_estimate: 0,
        rating: 4.5,
        tiktok_popularity: "Rất cao",
        distance_to_next: "3.5 km (8 phút di chuyển)",
        reason: "Check-in mái vòm thiết kế hình cánh diều khổng lồ bay cao biểu tượng mới đầy khát vọng của thành phố biển.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Công+viên+APEC+Đà+Nẵng"
    },
    {
        date: "27/06/2026",
        time_slot: "Chiều",
        stop_order: 8,
        location_name: "Lễ hội biển Đà Nẵng 2026 (An Hải Festival)",
        category: "Sự kiện",
        address: "Công viên Biển Đông, Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng",
        start_time: "16:00",
        end_time: "18:00",
        duration_minutes: 120,
        cost_estimate: 0,
        rating: 4.6,
        tiktok_popularity: "Rất cao",
        distance_to_next: "4.2 km (9 phút di chuyển)",
        reason: "Sự kiện hè đặc sắc, trải nghiệm các gian hàng sản phẩm OCOP địa phương và nghe trình diễn âm nhạc bãi biển.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Công+viên+Biển+Đông+Đà+Nẵng"
    },
    {
        date: "27/06/2026",
        time_slot: "Tối",
        stop_order: 9,
        location_name: "Bún mắm nêm Bé Hà",
        category: "Ăn uống",
        address: "130 Hùng Vương, Hải Châu 1, Hải Châu, Đà Nẵng",
        start_time: "18:00",
        end_time: "19:30",
        duration_minutes: 90,
        cost_estimate: 40000,
        rating: 4.5,
        tiktok_popularity: "Rất cao",
        distance_to_next: "1.8 km (5 phút di chuyển)",
        reason: "Ăn tối nhanh với bát bún mắm nêm đậm đà kết hợp thịt heo quay da giòn rụm và mít non hấp dẫn.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Bún+mắm+nêm+Bé+Hà+Đà+Nẵng"
    },
    {
        date: "27/06/2026",
        time_slot: "Tối",
        stop_order: 10,
        location_name: "Lễ hội Pháo hoa Quốc tế Đà Nẵng (DIFF) 2026 - Đêm 5",
        category: "Sự kiện",
        address: "Cảng Sông Hàn, vỉa hè Trần Hưng Đạo, Sơn Trà, Đà Nẵng",
        start_time: "19:30",
        end_time: "22:00",
        duration_minutes: 150,
        cost_estimate: 500000,
        rating: 4.8,
        tiktok_popularity: "Cực cao",
        distance_to_next: "1 km (3 phút di chuyển)",
        reason: "Tâm điểm sự kiện du lịch hè với màn tranh tài pháo hoa đỉnh cao của hai đội Úc và Bồ Đào Nha rực sáng sông Hàn.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Bến+du+thuyền+Sông+Hàn"
    },
    {
        date: "27/06/2026",
        time_slot: "Tối",
        stop_order: 11,
        location_name: "Cầu Rồng Phun Lửa / Nước",
        category: "Du lịch",
        address: "Đường Nguyễn Văn Linh, Phước Ninh, Hải Châu, Đà Nẵng",
        start_time: "22:00",
        end_time: "23:00",
        duration_minutes: 60,
        cost_estimate: 0,
        rating: 4.7,
        tiktok_popularity: "Rất cao",
        distance_to_next: "1.5 km (4 phút về khách sạn)",
        reason: "Chiêm ngưỡng màn trình diễn phun lửa & nước độc đáo cuối tuần của biểu tượng thành phố sông Hàn.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Cầu+Rồng+Đà+Nẵng"
    },

    // Day 4: 28/06/2026
    {
        date: "28/06/2026",
        time_slot: "Sáng",
        stop_order: 1,
        location_name: "Đèo Hải Vân & Check-in Cây Cô Đơn, Tiệm cafe hòn đá",
        category: "Check-in",
        address: "Đường đèo Hải Vân, Liên Chiểu, Đà Nẵng",
        start_time: "06:00",
        end_time: "08:30",
        duration_minutes: 150,
        cost_estimate: 30000,
        rating: 4.7,
        tiktok_popularity: "Rất cao",
        distance_to_next: "28 km (45 phút di chuyển)",
        reason: "Chinh phục 'Thiên hạ đệ nhất hùng quan' ngắm vịnh biển Đà Nẵng tuyệt sắc sương phủ và uống cafe sớm.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Đèo+Hải+Vân"
    },
    {
        date: "28/06/2026",
        time_slot: "Sáng",
        stop_order: 2,
        location_name: "Cơm gà A Hải",
        category: "Ăn uống",
        address: "96 Phan Châu Trinh, Phước Ninh, Hải Châu, Đà Nẵng",
        start_time: "08:30",
        end_time: "09:30",
        duration_minutes: 60,
        cost_estimate: 60000,
        rating: 4.5,
        tiktok_popularity: "Cao",
        distance_to_next: "1.2 km (4 phút di chuyển)",
        reason: "Ăn sáng muộn / trưa sớm bằng đĩa cơm gà quay giòn tan, ngọt thịt trứ danh bậc nhất Đà thành.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Cơm+gà+A+Hải+Đà+Nẵng"
    },
    {
        date: "28/06/2026",
        time_slot: "Sáng",
        stop_order: 3,
        location_name: "Chợ Cồn Đà Nẵng (Mua sắm & Tham quan)",
        category: "Vui chơi",
        address: "290 Hùng Vương, Vĩnh Trung, Hải Châu, Đà Nẵng",
        start_time: "09:30",
        end_time: "11:00",
        duration_minutes: 90,
        cost_estimate: 50000,
        rating: 4.5,
        tiktok_popularity: "Rất cao",
        distance_to_next: "0 km (tại chỗ)",
        reason: "Khám phá ngôi chợ truyền thống sầm uất bậc nhất, tham quan các gian hàng đặc sản làm quà lưu niệm.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Chợ+Cồn+Đà+Nẵng"
    },
    {
        date: "28/06/2026",
        time_slot: "Trưa",
        stop_order: 4,
        location_name: "Food tour Chợ Cồn (Ăn trưa)",
        category: "Ăn uống",
        address: "Khu ẩm thực Chợ Cồn, Hải Châu, Đà Nẵng",
        start_time: "11:00",
        end_time: "12:30",
        duration_minutes: 90,
        cost_estimate: 80000,
        rating: 4.5,
        tiktok_popularity: "Rất cao",
        distance_to_next: "2.5 km (7 phút di chuyển)",
        reason: "Càn quét thiên đường ăn vặt với bún lòng nghệ Cô Cúc, bánh bèo, bánh lọc, ram cuốn lá cải ngon quên sầu.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Chợ+Cồn+Đà+Nẵng"
    },
    {
        date: "28/06/2026",
        time_slot: "Trưa",
        stop_order: 5,
        location_name: "Ibasho Coffee & Hostel",
        category: "Cafe",
        address: "124-126 Yên Khê 1, Hòa Minh, Thanh Khê, Đà Nẵng",
        start_time: "12:30",
        end_time: "14:00",
        duration_minutes: 90,
        cost_estimate: 45000,
        rating: 4.6,
        tiktok_popularity: "Rất cao",
        distance_to_next: "4.5 km (10 phút di chuyển)",
        reason: "Quán cafe phong cách tối giản Nhật Bản ngập tràn ánh nắng tự nhiên, góc check-in tinh tế và rất mát mẻ.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Ibasho+Coffee+Đà+Nẵng"
    },
    {
        date: "28/06/2026",
        time_slot: "Chiều",
        stop_order: 6,
        location_name: "Check-in Cầu Nguyễn Văn Trỗi",
        category: "Check-in",
        address: "Cầu Nguyễn Văn Trỗi, Hải Châu, Đà Nẵng",
        start_time: "14:00",
        end_time: "15:30",
        duration_minutes: 90,
        cost_estimate: 0,
        rating: 4.5,
        tiktok_popularity: "Cao",
        distance_to_next: "11 km (20 phút di chuyển)",
        reason: "Dạo bước trên cây cầu dã chiến bằng giàn thép vàng lịch sử đầy cổ kính và ngắm hoàng hôn sông Hàn.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Cầu+Nguyễn+Văn+Trỗi"
    },
    {
        date: "28/06/2026",
        time_slot: "Chiều",
        stop_order: 7,
        location_name: "Nami Beach Club (Mikazuki Resort)",
        category: "Cafe",
        address: "Đường Nguyễn Tất Thành, Hòa Hiệp Nam, Liên Chiểu, Đà Nẵng",
        start_time: "15:30",
        end_time: "17:00",
        duration_minutes: 90,
        cost_estimate: 100000,
        rating: 4.6,
        tiktok_popularity: "Rất cao",
        distance_to_next: "9 km (16 phút di chuyển)",
        reason: "Ngắm hoàng hôn vịnh biển siêu lãng mạn sát biển, phong cách nhiệt đới cực kỳ sang chảnh nổi rần rần trên TikTok.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Nami+Beach+Club+Mikazuki"
    },
    {
        date: "28/06/2026",
        time_slot: "Chiều",
        stop_order: 8,
        location_name: "Chuẩn bị hành lý & di chuyển ra sân bay",
        category: "Di chuyển",
        address: "Sân bay Quốc tế Đà Nẵng, Hải Châu, Đà Nẵng",
        start_time: "17:00",
        end_time: "18:00",
        duration_minutes: 60,
        cost_estimate: 100000,
        rating: 4.4,
        tiktok_popularity: "Trung bình",
        distance_to_next: "0 km (kết thúc)",
        reason: "Mua sắm nốt các đặc sản làm quà, làm thủ tục gửi hành lý và kiểm tra an ninh tại sân bay.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Sân+bay+Quốc+tế+Đà+Nẵng"
    },
    {
        date: "28/06/2026",
        time_slot: "Tối",
        stop_order: 9,
        location_name: "Bay về nhà, kết thúc hành trình",
        category: "Di chuyển",
        address: "Sân bay Quốc tế Đà Nẵng",
        start_time: "18:00",
        end_time: "21:00",
        duration_minutes: 180,
        cost_estimate: 0,
        rating: 4.4,
        tiktok_popularity: "Trung bình",
        distance_to_next: "0 km",
        reason: "Bay trở về nhà, kết thúc trọn vẹn chuyến du lịch khám phá Đà Nẵng 4 ngày 3 đêm.",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Sân+bay+Quốc+tế+Đà+Nẵng"
    }
];

// 2. Define Events Data
const EVENTS = [
    {
        event_date: "27/06/2026",
        event_name: "Lễ hội Pháo hoa Quốc tế Đà Nẵng (DIFF) 2026 - Đêm 5",
        event_type: "Lễ hội",
        start_time: "20:00",
        end_time: "22:00",
        location: "Khu vực Cảng Sông Hàn và vỉa hè đường Trần Hưng Đạo, Sơn Trà, Đà Nẵng",
        ticket_price: "Từ 800.000đ - 3.000.000đ (Xem miễn phí từ xa dọc sông)",
        description: "Đêm thi đấu thứ 5 mang chủ đề 'Tầm nhìn' (Vision) giữa hai đội Úc và Bồ Đào Nha. Trình diễn nghệ thuật ánh sáng và âm thanh hoành tráng bên sông Hàn.",
        source_url: "https://danangfantasticity.com"
    },
    {
        event_date: "27/06/2026",
        event_name: "Lễ hội biển Đà Nẵng 2026 (An Hải Festival)",
        event_type: "Lễ hội biển",
        start_time: "16:00",
        end_time: "18:00",
        location: "Công viên Biển Đông và bãi biển Mỹ Khê, Sơn Trà, Đà Nẵng",
        ticket_price: "Miễn phí",
        description: "Chuỗi sự kiện 'Sóng Âm và Vị Giác', bao gồm hơn 100 gian hàng ẩm thực biển, đặc sản đường phố OCOP kết hợp không gian âm nhạc acoustic và DJ hiện đại.",
        source_url: "https://danang.gov.vn"
    },
    {
        event_date: "27/06/2026",
        event_name: "Cầu Rồng phun lửa, phun nước",
        event_type: "Trình diễn nghệ thuật",
        start_time: "21:00",
        end_time: "21:15",
        location: "Cầu Rồng, đường Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
        ticket_price: "Miễn phí",
        description: "Hoạt động trình diễn phun lửa (9 lần) và phun nước (3 lần) định kỳ mỗi cuối tuần (thứ Bảy & Chủ Nhật) thu hút đông đảo du khách.",
        source_url: "https://danangfantasticity.com"
    },
    {
        event_date: "28/06/2026",
        event_name: "Cầu Rồng phun lửa, phun nước",
        event_type: "Trình diễn nghệ thuật",
        start_time: "21:00",
        end_time: "21:15",
        location: "Cầu Rồng, đường Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
        ticket_price: "Miễn phí",
        description: "Hoạt động trình diễn phun lửa và phun nước định kỳ của biểu tượng thành phố biển Đà Nẵng.",
        source_url: "https://danangfantasticity.com"
    }
];

// 3. Read Recommendations from existing database (data.js)
let RECOMMENDATIONS = [];
try {
    const dataJsContent = fs.readFileSync(dataJsPath, 'utf-8');
    // Simple regex parse to get RECOMMENDATIONS array
    const startIdx = dataJsContent.indexOf('const RECOMMENDATIONS =');
    if (startIdx !== -1) {
        const jsonText = dataJsContent.substring(startIdx + 'const RECOMMENDATIONS ='.length).trim().replace(/;$/, '');
        RECOMMENDATIONS = JSON.parse(jsonText);
    }
} catch (e) {
    console.error("Could not parse existing RECOMMENDATIONS, writing fallback recommendations", e);
}

// Fallback recommendations if empty or failed
if (RECOMMENDATIONS.length === 0) {
    RECOMMENDATIONS = [
        {
            name: "Mì Quảng Bà Mua",
            category: "Ăn uống",
            address: "19-21 Trần Bình Trọng, Hải Châu, Đà Nẵng",
            price_range: "40k - 60k VND",
            rating: 4.5,
            tiktok_hot: true,
            reason: "Mì Quảng hương vị truyền thống đậm đà, thương hiệu lâu đời, được đông đảo du khách đánh giá cao.",
            maps_url: "https://www.google.com/maps/search/?api=1&query=Mì+Quảng+Bà+Mua+Trần+Bình+Trọng"
        }
        // ... We will read the file so it should be fine.
    ];
}

// 4. Generate schedule.csv
try {
    let csvContent = 'date,time_slot,stop_order,location_name,category,address,start_time,end_time,duration_minutes,cost_estimate,rating,tiktok_popularity,distance_to_next,reason,google_maps_url\n';
    
    ITINERARY.forEach(item => {
        csvContent += `${escapeCSV(item.date)},${escapeCSV(item.time_slot)},${item.stop_order},${escapeCSV(item.location_name)},${escapeCSV(item.category)},${escapeCSV(item.address)},${escapeCSV(item.start_time)},${escapeCSV(item.end_time)},${item.duration_minutes},${item.cost_estimate},${item.rating},${escapeCSV(item.tiktok_popularity)},${escapeCSV(item.distance_to_next)},${escapeCSV(item.reason)},${escapeCSV(item.google_maps_url)}\n`;
    });
    
    // Append Recommendations
    csvContent += '\n'; // empty line separator
    csvContent += 'name,category,address,price_range,rating,tiktok_hot,reason,maps_url\n';
    
    RECOMMENDATIONS.forEach(item => {
        csvContent += `${escapeCSV(item.name)},${escapeCSV(item.category)},${escapeCSV(item.address)},${escapeCSV(item.price_range)},${item.rating},${item.tiktok_hot ? 'Có' : 'Không'},${escapeCSV(item.reason)},${escapeCSV(item.maps_url)}\n`;
    });
    
    fs.writeFileSync(scheduleCsvPath, csvContent, 'utf-8');
    console.log(`Generated schedule.csv at ${scheduleCsvPath}`);
} catch (err) {
    console.error('Error generating schedule.csv:', err);
}

// 5. Generate events.csv
try {
    let eventsCsvContent = 'event_date,event_name,event_type,start_time,end_time,location,ticket_price,description,source_url\n';
    
    EVENTS.forEach(event => {
        eventsCsvContent += `${escapeCSV(event.event_date)},${escapeCSV(event.event_name)},${escapeCSV(event.event_type)},${escapeCSV(event.start_time)},${escapeCSV(event.end_time)},${escapeCSV(event.location)},${escapeCSV(event.ticket_price)},${escapeCSV(event.description)},${escapeCSV(event.source_url)}\n`;
    });
    
    fs.writeFileSync(eventsCsvPath, eventsCsvContent, 'utf-8');
    console.log(`Generated events.csv at ${eventsCsvPath}`);
} catch (err) {
    console.error('Error generating events.csv:', err);
}

// 6. Write data.js
try {
    const dataJsOutput = `// Auto-generated data from schedule.csv and events.csv
const ITINERARY = ${JSON.stringify(ITINERARY, null, 2)};

const RECOMMENDATIONS = ${JSON.stringify(RECOMMENDATIONS, null, 2)};

const EVENTS = ${JSON.stringify(EVENTS, null, 2)};
`;
    fs.writeFileSync(dataJsPath, dataJsOutput, 'utf-8');
    console.log(`Updated data.js at ${dataJsPath}`);
} catch (err) {
    console.error('Error updating data.js:', err);
}
