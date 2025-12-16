document.addEventListener('DOMContentLoaded', () => {
    // Existing Elements
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const promptOutput = document.getElementById('promptOutput');
    const outputSection = document.getElementById('outputSection');
    const themeToggle = document.getElementById('themeToggle');
    const refreshBtn = document.getElementById('refreshBtn');

    // New Lesson Feedback Elements
    const lessonGenerateBtn = document.getElementById('lessonGenerateBtn');
    const lessonCopyBtn = document.getElementById('lessonCopyBtn');
    const lessonPromptOutput = document.getElementById('lessonPromptOutput');
    const lessonOutputSection = document.getElementById('lessonOutputSection');
    const lessonRefreshBtn = document.getElementById('lessonRefreshBtn');

    // Navigation Elements
    const navItems = document.querySelectorAll('.nav-item');
    const pageSections = document.querySelectorAll('.page-section');
    const pageDescription = document.getElementById('pageDescription');

    // Theme Toggle Logic
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- Navigation Logic ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');

            // Update Active Nav Item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show Target Page
            pageSections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.remove('hidden');
                    section.classList.add('active');
                } else {
                    section.classList.add('hidden');
                    section.classList.remove('active');
                }
            });

            // Update Header Description
            if (targetId === 'page-student-feedback') {
                pageDescription.textContent = 'Tạo prompt phản hồi học sinh nhanh chóng va chuyên nghiệp';
            } else if (targetId === 'page-lesson-feedback') {
                pageDescription.textContent = 'Tạo báo cáo tổng kết buổi học chuyên nghiệp';
            }
        });
    });


    // --- Student Feedback Logic (Existing) ---

    refreshBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn làm mới tất cả thông tin học sinh?')) {
            document.getElementById('studentName').value = '';
            document.getElementById('lessonContent').value = '';

            const criteriaItems = document.querySelectorAll('.criteria-item');
            criteriaItems.forEach(item => {
                const range = item.querySelector('input[type="range"]');
                const output = item.querySelector('output');
                range.value = 8;
                output.textContent = 8;
            });

            const attitudeCheckboxes = document.querySelectorAll('input[name="attitude"]');
            attitudeCheckboxes.forEach(cb => cb.checked = false);

            outputSection.classList.add('hidden');
            promptOutput.textContent = '';
        }
    });

    generateBtn.addEventListener('click', generatePrompt);
    copyBtn.addEventListener('click', () => copyToClipboard(promptOutput, copyBtn));

    function generatePrompt() {
        const studentName = document.getElementById('studentName').value.trim();
        const lessonContent = document.getElementById('lessonContent').value.trim();

        if (!studentName || !lessonContent) {
            alert('Vui lòng nhập tên học sinh và nội dung bài học!');
            return;
        }

        const knowledgeCriteria = [];
        const criteriaItems = document.querySelectorAll('.criteria-item');

        criteriaItems.forEach(item => {
            const checkbox = item.querySelector('input[name="criteria_include"]');
            if (checkbox.checked) {
                const criteriaName = checkbox.value;
                const score = item.querySelector('input[type="range"]').value;
                knowledgeCriteria.push({ name: criteriaName, score: score });
            }
        });

        const attitudeItems = [];
        const attitudeCheckboxes = document.querySelectorAll('input[name="attitude"]:checked');
        attitudeCheckboxes.forEach(cb => {
            attitudeItems.push(cb.value);
        });

        const promptText = `
Hãy đóng vai trò là một giáo viên tiếng Anh nghiêm khắc và chuyên nghiệp. Dựa trên thông tin dưới đây, hãy viết một đoạn nhận xét ngắn gọn, súc tích (khoảng 150-200 chữ) bằng tiếng Việt dành cho phụ huynh của học sinh.

Thông tin học sinh:
- Tên: ${studentName}
- Nội dung bài học: ${lessonContent}

Kết quả học tập (Thang điểm 10):
${knowledgeCriteria.map(k => `- ${k.name}: ${k.score}/10`).join('\n')}

Thái độ học tập:
${attitudeItems.length > 0 ? attitudeItems.map(a => `- ${a}`).join('\n') : '- (Không ghi nhận đặc biệt)'}

Yêu cầu output:
1. Viết 2 đoạn nhận xét riêng biệt cho "Tiếp thu kiến thức" và "Thái độ học tập".
2. Ngôn ngữ: Tiếng Việt, giọng văn thẳng thắn, khách quan, đi thẳng vào vấn đề.
3. TUYỆT ĐỐI KHÔNG có lời chào đầu thư (như "Chào phụ huynh", "Gửi gia đình"...).
4. TUYỆT ĐỐI KHÔNG có lời khen ngợi sáo rỗng hay động viên cuối thư (như "Cố gắng phát huy", "Chúc em học tốt"...). Chỉ tập trung vào nhận xét năng lực thực tế.
5. Xưng hô: Gọi học sinh là "em" hoặc "${studentName}".
6. KHÔNG liệt kê điểm số cụ thể (ví dụ: không viết "8/10") trong bài nhận xét. Chỉ dùng điểm số để định lượng mức độ nhận xét.
7. Đặt nội dung nhận xét "Tiếp thu kiến thức" vào trong block code markdown đầu tiên. LƯU Ý: Chỉ xuất ra nội dung text thuần túy, KHÔNG bao gồm tiêu đề (như "Tiếp thu kiến thức").
8. Đặt nội dung nhận xét "Thái độ học tập" vào trong block code markdown thứ hai. LƯU Ý: Chỉ xuất ra nội dung text thuần túy, KHÔNG bao gồm tiêu đề (như "Thái độ học tập").
`.trim();

        promptOutput.textContent = promptText;
        outputSection.classList.remove('hidden');
        outputSection.scrollIntoView({ behavior: 'smooth' });
    }


    // --- Whole Lesson Feedback Logic (New) ---

    lessonRefreshBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn làm mới tất cả thông tin buổi học?')) {
            document.getElementById('lessonName').value = '';
            document.getElementById('lessonSummary').value = '';
            document.getElementById('improvementAreas').value = '';
            document.getElementById('nextLessonPlan').value = '';

            // Reset radio to first option (Rất tích cực)
            const firstRadio = document.querySelector('input[name="classAttitude"][value="Rất tích cực"]');
            if (firstRadio) firstRadio.checked = true;

            lessonOutputSection.classList.add('hidden');
            lessonPromptOutput.textContent = '';
        }
    });

    lessonGenerateBtn.addEventListener('click', generateLessonFeedback);
    lessonCopyBtn.addEventListener('click', () => copyToClipboard(lessonPromptOutput, lessonCopyBtn));

    function generateLessonFeedback() {
        const lessonName = document.getElementById('lessonName').value.trim();
        const lessonSummary = document.getElementById('lessonSummary').value.trim();
        const improvementAreas = document.getElementById('improvementAreas').value.trim();
        const nextLessonPlan = document.getElementById('nextLessonPlan').value.trim();

        let classAttitude = "Bình thường";
        const attitudeRadio = document.querySelector('input[name="classAttitude"]:checked');
        if (attitudeRadio) {
            classAttitude = attitudeRadio.value;
        }

        if (!lessonName || !lessonSummary) {
            alert('Vui lòng nhập Tên bài học và Nội dung đã dạy!');
            return;
        }

        const promptText = `
Hãy đóng vai trò là một giáo viên tiếng Anh chuyên nghiệp. Dựa trên thông tin dưới đây, hãy viết một báo cáo tổng kết buổi học (Lesson Report) gửi cho phụ huynh/nhà trường.

Thông tin buổi học:
- Chủ đề/Bài học: ${lessonName}
- Nội dung đã dạy: ${lessonSummary}

Đánh giá lớp học:
- Thái độ chung của lớp: ${classAttitude}
- Điểm cần cải thiện: ${improvementAreas || "Không có ghi chú đặc biệt"}

Kế hoạch tiếp theo:
- ${nextLessonPlan || "Theo giáo trình"}

Yêu cầu output:
1. Viết một báo cáo ngắn gọn, chuyên nghiệp, súc tích (khoảng 200-250 chữ).
2. Chia thành 3 phần rõ ràng: "Nội dung đã học", "Nhận xét lớp học" (bao gồm thái độ và điểm cần cải thiện), và "Dặn dò/Kế hoạch tới".
3. Giọng văn: Trang trọng, khách quan, mang tính xây dựng.
4. Ngôn ngữ: Tiếng Việt.
5. Định dạng: Markdown, sử dụng bullet points cho các ý chính để dễ đọc.
`.trim();

        lessonPromptOutput.textContent = promptText;
        lessonOutputSection.classList.remove('hidden');
        lessonOutputSection.scrollIntoView({ behavior: 'smooth' });
    }

    // --- Shared Utilities ---

    function copyToClipboard(element, button) {
        const textToCopy = element.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('primary');
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('primary');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Không thể copy. Vui lòng chọn và copy thủ công.');
        });
    }
});
