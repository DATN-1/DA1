import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

const descriptions: Record<number, string> = {
  1: 'Nến thơm thủ công cao cấp với thiết kế độc đáo, hương thơm dịu nhẹ và tinh tế. Được làm từ 100% sáp đậu nành tự nhiên, phù hợp để trang trí và thư giãn.',
  2: 'Nến thơm với hương thơm hòa quyện từ lá sung, hoa gardenia, vetiver, gỗ tuyết tùng và hoa neroli. Loại nến sáp đặc biệt mang đến trải nghiệm hương thơm kéo dài suốt cả ngày.',
  5: 'Nến thơm với thiết kế họa tiết vẹt và ngọc trai tinh tế. Hương thơm nhẹ nhàng, thanh lịch phù hợp cho không gian phòng ngủ và phòng khách.',
  6: 'Nến thơm hương vanilla, gỗ đàn hương, rêu sồi, vỏ quít và hổ phách. Loại nến sáp cao cấp tạo hương thơm dài lâu, sang trọng trong không gian sống.',
  7: 'Nến thơm hương hoa nhài hoang dại, ylang ylang, thuốc lá trắng, bergamot và vỏ chanh kaffir. Mang đến không gian sống đầy hoa cỏ, quyến rũ và tinh tế.',
  8: 'Hương hoa mimosa và lily kết hợp với nền gỗ đàn hương tạo nên mùi hương táo bạo và tràn đầy sức sống. Nến thơm lý tưởng cho những người yêu thích hương thơm mạnh mẽ.',
  9: 'Nến thơm với hương đầu là hồi và melissa, hương giữa là quế và nhục đậu khấu, hương nền là vanilla và hổ phách. Thích hợp để làm quà tặng sáng tạo.',
  10: 'Nến thơm với hương đầu là cam ngọt và táo, hương giữa là hoa cỏ ba lá và mật ong hoang dã, hương nền là gỗ tuyết tùng và vani. Mùi hương tự nhiên ngọt ngào.',
  11: 'Nến thơm với hương đầu là cà phê, hương giữa là đường nâu, hương nền là vanilla và đinh hương. Thành phần 100% sáp đậu nành, bấc cotton tự nhiên an toàn.',
  12: 'Nến thơm khu vườn với hương đầu là bạc hà, hương giữa là cây elderberry và húng quế, hương nền là xô thơm và đất rừng. Mùi hương tươi mát, gợi nhớ thiên nhiên.',
  13: 'Nến thơm phòng xông hơi với hương đầu là bạch đàn và hoa hồng, hương giữa là gỗ tuyết tùng và lily, hương nền là nhựa thông balsam. Thư giãn và hồi phục tinh thần.',
  14: 'Nến thơm nhà kính với hương đầu là lá cà chua và ngò rí, hương giữa là nhựa galbanum và hoa nhài, hương nền là rễ cây và đất. Mùi hương xanh mát đặc trưng.',
  15: 'Nến pha lê thạch anh trong suốt kết hợp với tinh hoa của tiêu đen, cây bách xù và chanh myrtle giúp làm sạch năng lượng và mang lại sự tươi mới cho không gian sống.',
  16: 'Nến pha lê citrine độc đáo giúp đánh thức năng lượng sáng tạo và thể hiện mọi khát vọng. Mùi hương rực rỡ và năng động, phù hợp để thiền định và tu tập.',
  17: 'Nến pha lê thạch anh khói giúp thanh lọc tâm trí và định hướng rõ ràng hơn cho cuộc sống. Thiết kế tinh tế kết hợp vẻ đẹp tự nhiên của đá quý.',
  18: 'Hộp nhang giới hạn đặc biệt, hoàn hảo để làm quà tặng. Mỗi hộp chứa 8 mùi hương khác nhau, mỗi que nhang cháy trong 10 phút với hương thơm dịu nhẹ và tự nhiên.',
  19: 'Nhang vườn hoa HIBI với ba mùi hương mới tinh tế gợi lên vẻ đẹp của mùa xuân và khu vườn xanh mát. Mỗi que nhang cháy đúng 10 phút, hoàn hảo cho thiền định hằng ngày.',
  20: 'Nhang HIBI với ba mùi hương sâu lắng và đặc biệt, chạm đến cảm xúc thật sự của bạn. Trải nghiệm thiền định và thư giãn sâu trong chỉ 10 phút mỗi que nhang.',
  21: 'Nhang HIBI kết hợp nghề thủ công truyền thống hàng trăm năm của tỉnh Hyogo với hương thơm hiện đại. Mỗi que nhang cháy đúng 10 phút tinh tế và đặc biệt.',
  22: 'Nến thơm Bohemia với mùi hương bí ẩn và huyền diệu, như những buổi chiều tối thú vị. Hương thơm độc đáo phù hợp cho những tâm hồn phiêu lưu và sáng tạo.',
  23: 'Nến thơm Hygge mang đến cảm giác ấm cúng, lười biếng và thoải mái hoàn toàn. Thích hợp cho những buổi tối cuộn tròn với sách yêu thích hoặc bộ phim thú vị cùng người thân.',
  24: 'Nến thơm Silver Linings gợi lên hình ảnh mưa cầu vồng và đêm tuyết xem phim cùng bỏng ngô. Mùi hương trong trẻo và lạc quan, lý tưởng cho những ngày trời xấu.',
  25: 'Nến thơm Lemonade ngọt ngào, chua nhẹ và sảng khoái như ly nước chanh mùa hè. Mùi hương tươi mát và vui tươi, mang lại năng lượng tích cực cho không gian sống.',
  26: 'Nến thơm Dandy gợi lên không gian phòng đọc sách cổ điển. Hương thơm sâu lắng, nam tính và tinh tế dành cho những tâm hồn lãng mạn yêu thích sự cổ điển.',
  27: 'Nến thơm Aurora gợi nhớ cảnh lái xe ban đêm và nhìn thấy ánh đèn phương bắc huyền ảo trên bầu trời. Hương thơm kỳ diệu và thơ mộng, mang đến cảm giác phiêu lưu.',
  28: 'Nến thơm oải hương Ojai với hương thơm từ đồng cỏ oải hương dưới nắng vàng và vườn cam rực rỡ. Thanh lọc tâm trí và mang lại cảm giác bình yên sâu sắc.',
  29: 'Nến thơm San Francisco gợi lên cảnh đỉnh núi thành phố xuyên qua màn sương, ánh nắng chiều hôm và mùi biển mặn. Hương thơm đô thị độc đáo và đặc trưng.',
  30: 'Nến thơm Pinon tái hiện tinh tế hương thơm của cây thông piñon đặc trưng của vùng miền Tây. Ấm áp, mộc mạc và rất đặc biệt cho những người yêu thiên nhiên hoang sơ.',
  31: 'Nến thơm Sunbloom gợi lên cảm giác dạo chơi trong sa mạc mùa xuân với những đồng hoa nở rộ vô tận. Tươi sáng và tràn đầy sức sống dưới ánh mặt trời rực rỡ.',
  32: 'Nến thơm Black Fig huyền bí và cuốn hút, kết hợp hương xanh từ đỉnh cây thường xanh với nền hương nặng và bí ẩn. Dành cho những tâm hồn yêu thích sự độc đáo.',
  33: 'Nến thơm bưởi ngọt ngào và sảng khoái. Hương bưởi chín mọng không quá ngọt cũng không quá chua, hoàn hảo cho không gian bếp, phòng tắm hoặc văn phòng làm việc.',
  34: 'Nến thơm Amber và Moss gợi lên cuối tuần trong núi rừng, ánh nắng xuyên tán lá. Hương xô thơm, rêu và hoa oải hương quyện cùng gỗ tuyết tùng và hổ phách ấm áp.',
  35: 'Nhang Haze Palo Santo và xô thơm mang hương thơm thanh lọc và chữa lành. Thiết kế đẹp mắt tích hợp cả nhang và đế đốt nhang trong một sản phẩm tiện lợi và thẩm mỹ.',
  36: 'Nhang Haze hương thuốc lá và patchouli với thiết kế đẹp mắt kết hợp nhang và đế đốt nhang tiện lợi. Hương thơm ấm áp, bí ẩn và đặc trưng cho không gian thư giãn.',
  37: 'Nhang Haze Fresh Air mang đến hương thơm trong lành và tươi mát như bầu không khí sau cơn mưa. Thiết kế đẹp mắt tích hợp nhang và đế đốt tiện lợi, phù hợp mọi không gian.',
  38: 'Nhang Haze Pomelo Bay với hương bưởi tươi mát và dễ chịu. Thiết kế tích hợp nhang và đế đốt nhang trong một sản phẩm thẩm mỹ cao, phù hợp trang trí và thư giãn.',
  39: 'Nhang Haze Cotton và gỗ Teak với hương thơm sạch sẽ và ấm áp. Thiết kế đẹp tích hợp nhang và đế đốt tiện lợi, lý tưởng cho không gian sống hiện đại và tối giản.',
  40: 'Nến thơm Our Place gợi lên cái nắng hè oi ả và những ngày dài thư thái. Hương thơm ấm áp và thân quen mang đến cảm giác bình yên và giao hòa cùng thiên nhiên.',
  41: 'Nến thơm Ocean Isle - sản phẩm hợp tác với nghệ sĩ Tây Úc tôn vinh vẻ đẹp của đại dương. Hương thơm biển cả tươi mát, trong lành và đầy cảm hứng sáng tạo.',
  42: 'Nến thơm Sirens với hương thơm huyền bí và quyến rũ. Mê hoặc và đầy sức sống, lý tưởng để tạo không khí lãng mạn và đặc biệt cho không gian sống của bạn.',
  43: 'Nến thơm Hidden Vale tôn vinh vẻ đẹp cổ xưa của Dãy núi Xanh và thiên nhiên hùng vĩ. Hương thơm kỳ vĩ và đầy tôn kính, gợi lên sự hoang sơ của đất mẹ thiên nhiên.',
  44: 'Nến thơm Nocturne với hương đầu bergamot và quít, hương giữa mật ong và oải hương, hương nền chồi hoa và nhựa cây. Dịu dàng, thơ mộng và hoàn hảo cho những đêm lãng mạn.',
  45: 'Nến thơm Ultraviolet với hương đầu bergamot và bưởi, hương giữa mật ong và hoa lily thung lũng, hương nền gỗ đàn hương và hoắc hương. Tươi sáng và tinh tế.',
  46: 'Nến thơm Study of Trees với hương đầu thông tươi, hương giữa hoa phong lữ thảo, hương nền gỗ đàn hương và gỗ tuyết tùng. Thiên nhiên thuần khiết trong từng hơi thở.',
  47: 'Nến du lịch Study of Trees kích thước nhỏ gọn tiện lợi mang theo. Hương thơm tươi mát của rừng cây xanh mát, màu sắc rực rỡ và thiết kế nghệ thuật độc đáo.',
  48: 'Nến gốm thực vật bản địa với hương thơm đặc trưng từ thực vật tự nhiên như bạch đàn, cây trà và oải hương. Nốt hương: chanh tươi, oải hương, bạch đàn, gỗ tuyết tùng và hoắc hương. Thời gian cháy 50-60 giờ.',
};

export async function GET() {
  try {
    const conn = await pool.getConnection();
    await conn.query('SET NAMES utf8mb4');
    
    const results = [];
    for (const [id, description] of Object.entries(descriptions)) {
      await conn.query('UPDATE products SET description = ? WHERE id = ?', [description, Number(id)]);
      results.push(`Updated product ID ${id}`);
    }
    
    conn.release();
    return NextResponse.json({ success: true, updated: results.length, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
