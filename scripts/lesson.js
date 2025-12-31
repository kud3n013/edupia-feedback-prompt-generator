document.addEventListener('DOMContentLoaded', () => {

    const lessonGenerateBtn = document.getElementById('lessonGenerateBtn');

    if (lessonGenerateBtn) {
        const lessonCopyBtn = document.getElementById('lessonCopyBtn');
        const lessonOutputSection = document.getElementById('lessonOutputSection');
        const lessonPromptOutput = document.getElementById('lessonPromptOutput');

        lessonGenerateBtn.addEventListener('click', () => {
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
        });

        if (lessonCopyBtn) {
            lessonCopyBtn.addEventListener('click', () => copyToClipboard(lessonPromptOutput, lessonCopyBtn));
        }
    }
});
