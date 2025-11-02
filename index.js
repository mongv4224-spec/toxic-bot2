const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.cooldowns = new Map();

// THAY 2 USER ID DƯỚI ĐÂY THÀNH ID THẬT CỦA BẠN VÀ BẠN BÈ
const ALLOWED_USERS = ['1030417740202258483', '1372547954044436563']; // ← CẬP NHẬT ĐÂY!

client.once('ready', () => {
  console.log(`Bot online: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'tags') return;

  // Kiểm tra quyền (chỉ 2 người dùng được)
  if (!ALLOWED_USERS.includes(interaction.user.id)) {
    return interaction.reply({ content: 'Bạn không có quyền dùng lệnh này!', ephemeral: true });
  }

  const user = interaction.options.getUser('user');
  const channel = interaction.options.getChannel('channel');

  // Cooldown 0.5 giây
  const now = Date.now();
  const cooldownAmount = 500;
  if (client.cooldowns.has(interaction.user.id)) {
    const expiration = client.cooldowns.get(interaction.user.id) + cooldownAmount;
    if (now < expiration) {
      const timeLeft = (expiration - now) / 1000;
      return interaction.reply({ content: `Chờ thêm **${timeLeft.toFixed(1)} giây**!`, ephemeral: true });
    }
  }
  client.cooldowns.set(interaction.user.id, now);
  setTimeout(() => client.cooldowns.delete(interaction.user.id), cooldownAmount);

  // Kiểm tra kênh
  if (!channel.isTextBased?.()) {
    return interaction.reply({ content: 'Vui lòng chọn kênh văn bản!', ephemeral: true });
  }

  // Kiểm tra quyền bot
  const botPerms = channel.permissionsFor(client.user);
  if (!botPerms?.has(['SendMessages', 'ViewChannel'])) {
    return interaction.reply({ content: 'Bot không có quyền gửi tin nhắn!', ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: true });

  // Danh sách tin nhắn cực mạnh
  const messages = [
      `# <@${user.id}> CON ĐĨ HÁNG RỘNG`,
      `# <@${user.id}> CON ĐĨ MỒM DÀI NHƯ CÁI CẦU`,
      `# <@${user.id}> COI ĐẤM CHẾT CON MẸ MẦY NHA THẰNG EM`,
      `# <@${user.id}> SAO MẦY NGU QUÁ DÃY MẦY BÚ CU CHA MẦY HAY SAO MÀ NGU DỮ DÃY EM`,
      `# <@${user.id}> COI CHỪNG ANH ĐỤ CHẾT CON CÁI MẸ MẦY NHA THẰNG EM`,
      `# <@${user.id}> MẦY SỢ ANH HAY GÌ DÃY THẰNG EM ƠI`,
      `# <@${user.id}> ĐỊT MẸ MẦY THẰNG NGU CÓ BA MẸ LÀ ANH EM RUỘT`,
      `# <@${user.id}> ANH ĐỊT CẢ LÀNG MẦY ĐẤY THẰNG EM ƠI`,
      `# <@${user.id}> ANH ĐỤ MẸ MẦY RỒI CÒN GÌ NỮA HẢ THẰNG EM`,
      `# <@${user.id}> MẦY CÓ BIẾT ANH LÀ AI KHÔNG HẢ THẰNG EM?`,
      `# <@${user.id}> CÁI THẰNG LỒN ĐỤ CON CHÓ`,
      `# <@${user.id}> CON ĐĨ LỒN BÚ CẶC ANH ĐI ĐÂY NÀY`,
      `# <@${user.id}> MẦY ĐI ĐỤ MẸ MẦY LUÔN THẰNG EM`,
      `# <@${user.id}> ANH ĐỊT MẸ MẦY RỒI CÒN GÌ NỮA HẢ THẰNG EM`,
      `# <@${user.id}> CON ĐĨ ĐIẾM LIỆT BƯỚM`,
      `# <@${user.id}> ĐỊT MẸ MẦY THẰNG NGU CÓ BA MẸ LÀ ANH EM`,
      `# <@${user.id}> MẦY BIẾT SỢ RỒI À THẰNG EM?`,
      `# <@${user.id}> CON LỒN ĐIẾM`,
      `# <@${user.id}> CON ĐĨ LỒN THỐI 10 NĂM CHƯA RỬA`,
      `# <@${user.id}> CON NGU ĐẦN ĂN CỨT`,
      `# <@${user.id}> MẸ MẦY ĐỒI BÚ CẶC ANH NÈ THẰNG EM`,
      `# <@${user.id}> MẸ MẦY CẦU XIN ANH ĐỊT MẸ MẦY ĐẤY THẰNG EM`,
      `# <@${user.id}> GẶP ANH LÀM CON MẸ MẦY BIẾT THẾ NÀO LÀ ĐAU ĐẤY THẰNG EM`,
      `# <@${user.id}> ĐỪNG ĐỂ ANH THẤY MẦY NHA THẰNG EM`
    ];

  // Gửi 5 tin nhắn ngẫu nhiên
  let successCount = 0;
  for (let i = 0; i < 5; i++) {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    try {
      await channel.send(randomMessage);
      successCount++;
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
      break;
    }
    await new Promise(r => setTimeout(r, Math.random() * 1000 + 800)); // Delay 0.8–1.8s
  }

  await interaction.followUp({
    content: successCount === 5
      ? `✅ Đã tag ${user} **${successCount} lần** trong ${channel}!`
      : `⚠️ Chỉ gửi được **${successCount}/5** tin nhắn (có thể do rate limit).`,
    ephemeral: true
  });
});

// Đăng nhập bot
client.login(process.env.TOKEN);