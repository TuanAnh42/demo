function initFaqToggle() {
  const faqBox = document.getElementById('faq');
  if (!faqBox) return;

  const faqQuestions = faqBox.querySelectorAll('.faq-question');

  faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const icon = question.querySelector('.toggle-icon');
      const isOpen = answer.style.display === 'block';

      // Ẩn tất cả câu trả lời và đặt lại icon thành "+"
      faqBox.querySelectorAll('.faq-answer').forEach((ans) => {
        ans.style.display = 'none';
      });
      faqBox.querySelectorAll('.faq-question .toggle-icon').forEach((i) => {
        i.textContent = '+';
      });

      // Nếu đang đóng thì mở ra và đổi icon thành "-"
      if (!isOpen) {
        answer.style.display = 'block';
        if (icon) icon.textContent = '–';
      }
    });
  });

  // Mặc định ẩn hết câu trả lời khi trang tải
  faqBox.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
}
document.addEventListener('DOMContentLoaded', initFaqToggle);
