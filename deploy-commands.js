require('dotenv').config(); // ← DÒNG QUAN TRỌNG NHẤT!

const { REST, Routes } = require('discord.js');

// THAY 'ID_BOT_CỦA_BẠN' BẰNG APPLICATION ID THẬT (Từ Discord Developer)
const BOT_ID = '1298614069246431243'; // ← ĐÃ ĐÚNG!

const commands = [
  {
    name: 'tags',
    description: 'Tag 1 người 5 lần trong 1 kênh (ngẫu nhiên, vui)',
    options: [
      {
        name: 'user',
        description: 'Chọn người cần tag',
        type: 6, // USER
        required: true
      },
      {
        name: 'channel',
        description: 'Chọn kênh để gửi tin nhắn',
        type: 7, // CHANNEL
        required: true
      }
    ]
  }
];

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Đang đăng ký lệnh /tags...');
    await rest.put(
      Routes.applicationCommands(BOT_ID),
      { body: commands }
    );
    console.log('Đăng ký lệnh thành công!');
  } catch (error) {
    console.error('Lỗi đăng ký lệnh:', error);
  }
})();