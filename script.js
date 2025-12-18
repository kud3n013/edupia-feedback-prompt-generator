document.addEventListener('DOMContentLoaded', () => {
    // Existing Elements
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const promptOutput = document.getElementById('promptOutput');
    const outputSection = document.getElementById('outputSection');

    // Navigation & Page Elements
    const navItems = document.querySelectorAll('.nav-item');
    const pageSections = document.querySelectorAll('.page-section');
    const pageDescription = document.getElementById('pageDescription');

    // Student Feedback Elements
    const refreshBtn = document.getElementById('refreshBtn');

    // Lesson Feedback Elements
    const lessonRefreshBtn = document.getElementById('lessonRefreshBtn');
    const lessonGenerateBtn = document.getElementById('lessonGenerateBtn');
    const lessonCopyBtn = document.getElementById('lessonCopyBtn');
    const lessonOutputSection = document.getElementById('lessonOutputSection');
    const lessonPromptOutput = document.getElementById('lessonPromptOutput');

    // Theme Toggle Logic
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeCheckbox = document.getElementById('themeToggleCheckbox');

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeCheckbox) themeCheckbox.checked = true;
    }

    if (themeCheckbox) {
        themeCheckbox.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- Navigation Logic ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            if (!targetId) return;

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
            document.getElementById('checkAtmosphere').checked = true;
            document.getElementById('selectAtmosphere').value = 'Sôi nổi';

            document.getElementById('checkProgress').checked = true;
            document.getElementById('selectProgress').value = 'Bình thường';

            document.getElementById('checkLate').checked = false;
            document.getElementById('inputLate').value = '';

            const reminderCheckboxes = document.querySelectorAll('input[name="reminder"]');
            reminderCheckboxes.forEach(cb => cb.checked = false);

            lessonOutputSection.classList.add('hidden');
            lessonPromptOutput.textContent = '';
        }
    });

    lessonGenerateBtn.addEventListener('click', generateLessonFeedback);
    lessonCopyBtn.addEventListener('click', () => copyToClipboard(lessonPromptOutput, lessonCopyBtn));

    function generateLessonFeedback() {
        // Part 1: General Info
        let sentences = [];

        // Atmosphere Mapping
        const atmosphereMap = {
            'Sôi nổi': 'sôi nổi, các con hào hứng phát biểu xây dựng bài',
            'Trầm lặng': 'hơi trầm, các con cần tương tác nhiều hơn'
        };

        // Progress Mapping
        const progressMap = {
            'Bình thường': 'tốt đẹp, các con đều hiểu bài',
            'Trễ': 'kết thúc muộn hơn dự kiến một chút',
            'Sớm': 'kết thúc sớm hơn dự kiến'
        };

        // Atmosphere
        if (document.getElementById('checkAtmosphere').checked) {
            const val = document.getElementById('selectAtmosphere').value;
            const text = atmosphereMap[val] || val;
            sentences.push(`Không khí lớp học ${text}`);
        }

        // Progress
        if (document.getElementById('checkProgress').checked) {
            const val = document.getElementById('selectProgress').value;
            const text = progressMap[val] || val;
            sentences.push(`Buổi học diễn ra ${text}`);
        }

        // Late
        if (document.getElementById('checkLate').checked) {
            const val = document.getElementById('inputLate').value.trim();
            if (val) sentences.push(`Bạn ${val} vào muộn`);
        }

        let part1Text = "";
        if (sentences.length > 0) {
            part1Text = "1. " + sentences.join(". ") + ".";
        }

        // Part 2: Reminders
        let part2Text = "";
        const reminderCheckboxes = document.querySelectorAll('input[name="reminder"]:checked');
        if (reminderCheckboxes.length > 0) {
            const reminders = Array.from(reminderCheckboxes).map(cb => cb.value).join(", ");
            part2Text = `2. PH nhớ nhắc các em hoàn thành ${reminders}.`;
        }

        // Combine
        const finalOutput = [part1Text, part2Text].filter(t => t).join("\n\n");

        if (!finalOutput) {
            alert('Vui lòng chọn ít nhất một thông tin để tạo feedback!');
            return;
        }

        lessonPromptOutput.textContent = finalOutput;
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
