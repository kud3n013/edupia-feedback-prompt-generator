document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation & Page Elements ---
    // (Only defined if sidebar exists - pages/students.html and pages/lesson.html have them)
    const pageDescription = document.getElementById('pageDescription');

    // --- Theme Toggle Logic ---
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


    // --- Lesson Feedback Logic ---
    const lessonGenerateBtn = document.getElementById('lessonGenerateBtn');
    if (lessonGenerateBtn) {
        const lessonFabRefresh = document.getElementById('lessonFabRefresh');
        const lessonCopyBtn = document.getElementById('lessonCopyBtn');
        const lessonOutputSection = document.getElementById('lessonOutputSection');
        const lessonPromptOutput = document.getElementById('lessonPromptOutput');

        if (lessonFabRefresh) {
            lessonFabRefresh.addEventListener('click', () => {
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
        }

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


    // --- Group Feedback Logic ---
    const groupGenerateBtn = document.getElementById('groupGenerateBtn');
    if (groupGenerateBtn) {
        // Data / Config
        const MAX_STUDENTS = 6;
        const CRITERIA_LIST = ['Từ vựng', 'Ngữ pháp', 'Ngữ âm', 'Đọc hiểu', 'Nghe hiểu', 'Phản xạ', 'Phát âm'];
        const ATTITUDE_DATA = {
            'Năng lượng / Tinh thần': ['tích cực', 'sôi nổi', 'vui vẻ', 'hứng thú', 'tự tin', 'lạc quan', 'mệt mỏi', 'chán nản', 'trầm tính', 'tự ti', 'xấu hổ', 'ngại nói'],
            'Khả năng tập trung': ['tập trung nghe giảng', 'chú ý bài học', 'tích cực phát biểu', 'sao nhãng', 'làm việc riêng', 'không tập trung', 'lơ là'],
            'Thái độ với bạn học': ['hòa đồng', 'biết chia sẻ', 'giúp đỡ bạn bè', 'nóng nảy', 'chưa hòa đồng'],
            'Thái độ với giáo viên': ['biết nghe lời', 'lễ phép', 'ngoan ngoãn', 'chưa vâng lời', 'phải nhắc nhở nhiều']
        };

        // State
        let groupState = {
            studentCount: 4,
            knowledgeMode: 'individual', // 'bulk' or 'individual'
            attitudeMode: 'individual',
            schoolLevel: 'TH', // 'TH' or 'THCS'
            marketingName: '',
            students: Array.from({ length: MAX_STUDENTS }, () => ({
                name: '',
                scores: {},
                attitudes: []
            })),
            includedCriteria: ['Từ vựng', 'Ngữ pháp', 'Phản xạ'],
            includedAttitudeCategories: Object.keys(ATTITUDE_DATA)
        };

        // Initialize Scores
        groupState.students.forEach(s => {
            CRITERIA_LIST.forEach(c => s.scores[c] = 8);
        });

        // Elements
        const studentsContainer = document.getElementById('studentsContainer');
        const studentCountInput = document.getElementById('studentCountInput');
        const studentCountDisplay = document.getElementById('studentCountDisplay');
        const navBadge = document.getElementById('navBadge');

        const knowledgeGroupContainer = document.getElementById('knowledgeGroupContainer');
        const attitudeGroupContainer = document.getElementById('attitudeGroupContainer');
        const groupFabRefresh = document.getElementById('groupFabRefresh');
        const groupCopyBtn = document.getElementById('groupCopyBtn');
        const groupPromptOutput = document.getElementById('groupPromptOutput');
        const groupOutputSection = document.getElementById('groupOutputSection');

        // Functions defined inside to access state (or could be external with state param)
        // For simplicity, keeping structure similar to before but cleaner scoping.

        function renderStudentInputs() {
            studentsContainer.innerHTML = '';
            studentsContainer.style.gridTemplateColumns = `repeat(${groupState.studentCount}, 1fr)`;

            for (let i = 0; i < groupState.studentCount; i++) {
                const div = document.createElement('div');
                div.className = 'form-group';
                const label = document.createElement('label');
                label.textContent = `Học sinh ${i + 1}`;
                const input = document.createElement('input');
                input.type = 'text';
                input.id = `s${i + 1}_name`;
                input.placeholder = `Tên HS ${i + 1}`;
                input.value = groupState.students[i].name || '';
                input.addEventListener('input', (e) => {
                    groupState.students[i].name = e.target.value;
                    if (groupState.knowledgeMode === 'individual') renderGroupKnowledge();
                    if (groupState.attitudeMode === 'individual') renderGroupAttitude();
                });
                div.appendChild(label);
                div.appendChild(input);
                studentsContainer.appendChild(div);
            }
        }

        function renderGroupKnowledge() {
            knowledgeGroupContainer.innerHTML = '';
            const isBulk = groupState.knowledgeMode === 'bulk';

            // Selection Bar
            const selectionBar = document.createElement('div');
            selectionBar.className = 'checkbox-grid';
            selectionBar.style.marginBottom = '1.5rem';
            selectionBar.style.paddingBottom = '1rem';
            selectionBar.style.borderBottom = '1px solid rgba(99, 102, 241, 0.1)';

            CRITERIA_LIST.forEach(criteria => {
                const label = document.createElement('label');
                label.className = 'pill-checkbox';
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.value = criteria;
                input.checked = groupState.includedCriteria.includes(criteria);
                input.onchange = (e) => {
                    if (e.target.checked) {
                        if (!groupState.includedCriteria.includes(criteria)) {
                            groupState.includedCriteria.push(criteria);
                            groupState.includedCriteria.sort((a, b) => CRITERIA_LIST.indexOf(a) - CRITERIA_LIST.indexOf(b));
                        }
                    } else {
                        groupState.includedCriteria = groupState.includedCriteria.filter(c => c !== criteria);
                    }
                    renderGroupKnowledge();
                };
                const span = document.createElement('span');
                span.textContent = criteria;
                label.appendChild(input);
                label.appendChild(span);
                selectionBar.appendChild(label);
            });
            knowledgeGroupContainer.appendChild(selectionBar);

            // Active Rows
            CRITERIA_LIST.forEach(criteria => {
                if (!groupState.includedCriteria.includes(criteria)) return;
                const row = document.createElement('div');
                row.className = 'group-row';

                const headerDiv = document.createElement('div');
                headerDiv.style.marginBottom = '0.5rem';
                const labelText = document.createElement('h4');
                labelText.textContent = criteria;
                labelText.style.margin = '0';
                labelText.style.color = 'var(--primary-color)';
                headerDiv.appendChild(labelText);
                row.appendChild(headerDiv);

                const grid = document.createElement('div');
                grid.className = `group-controls-grid ${isBulk ? 'bulk-mode' : ''}`;
                grid.style.gridTemplateColumns = isBulk ? '1fr' : `repeat(${groupState.studentCount}, 1fr)`;

                const loopCount = isBulk ? 1 : groupState.studentCount;
                for (let i = 0; i < loopCount; i++) {
                    const studentIndex = i;
                    const wrapper = document.createElement('div');
                    wrapper.className = 'control-item';

                    const label = document.createElement('label');
                    if (isBulk) {
                        label.textContent = "Tất cả học sinh";
                    } else {
                        const sName = document.getElementById(`s${i + 1}_name`)?.value || `HS ${i + 1}`;
                        label.textContent = sName;
                    }
                    wrapper.appendChild(label);

                    const slider = document.createElement('input');
                    slider.type = 'range';
                    slider.min = 1;
                    slider.max = 10;
                    slider.value = groupState.students[isBulk ? 0 : studentIndex].scores[criteria];

                    const output = document.createElement('div');
                    output.style.fontWeight = 'bold';
                    output.style.color = 'var(--primary-color)';
                    output.textContent = slider.value;

                    slider.oninput = (e) => {
                        const val = e.target.value;
                        output.textContent = val;
                        if (isBulk) {
                            groupState.students.forEach(s => s.scores[criteria] = val);
                        } else {
                            groupState.students[studentIndex].scores[criteria] = val;
                        }
                    };
                    wrapper.appendChild(slider);
                    wrapper.appendChild(output);
                    attachSliderWheelEvent(slider);
                    grid.appendChild(wrapper);
                }
                row.appendChild(grid);
                knowledgeGroupContainer.appendChild(row);
            });
        }

        function renderGroupAttitude() {
            attitudeGroupContainer.innerHTML = '';
            const isBulk = groupState.attitudeMode === 'bulk';
            const categories = Object.keys(ATTITUDE_DATA);

            const selectionBar = document.createElement('div');
            selectionBar.className = 'checkbox-grid';
            selectionBar.style.marginBottom = '1.5rem';
            selectionBar.style.paddingBottom = '1rem';
            selectionBar.style.borderBottom = '1px solid rgba(99, 102, 241, 0.1)';

            categories.forEach(cat => {
                const label = document.createElement('label');
                label.className = 'pill-checkbox';
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.value = cat;
                input.checked = groupState.includedAttitudeCategories.includes(cat);
                input.onchange = (e) => {
                    if (e.target.checked) {
                        if (!groupState.includedAttitudeCategories.includes(cat)) {
                            groupState.includedAttitudeCategories.push(cat);
                            groupState.includedAttitudeCategories.sort((a, b) => categories.indexOf(a) - categories.indexOf(b));
                        }
                    } else {
                        groupState.includedAttitudeCategories = groupState.includedAttitudeCategories.filter(c => c !== cat);
                    }
                    renderGroupAttitude();
                };
                const span = document.createElement('span');
                span.textContent = cat;
                label.appendChild(input);
                label.appendChild(span);
                selectionBar.appendChild(label);
            });
            attitudeGroupContainer.appendChild(selectionBar);

            for (const [category, items] of Object.entries(ATTITUDE_DATA)) {
                if (!groupState.includedAttitudeCategories.includes(category)) continue;

                const catDiv = document.createElement('div');
                catDiv.className = 'attitude-category';
                const title = document.createElement('h4');
                title.textContent = category;
                catDiv.appendChild(title);

                const grid = document.createElement('div');
                grid.className = `attitude-grid-layout ${isBulk ? 'bulk-mode' : ''}`;
                grid.style.gridTemplateColumns = isBulk ? '1fr' : `repeat(${groupState.studentCount}, 1fr)`;

                const loopCount = isBulk ? 1 : groupState.studentCount;
                for (let i = 0; i < loopCount; i++) {
                    const studentIndex = i;
                    const col = document.createElement('div');
                    col.className = 'student-attitude-col';

                    if (!isBulk) {
                        const lbl = document.createElement('div');
                        lbl.className = 'student-label';
                        const sName = document.getElementById(`s${i + 1}_name`)?.value || `HS ${i + 1}`;
                        lbl.textContent = sName;
                        col.appendChild(lbl);
                    }

                    const pillContainer = document.createElement('div');
                    pillContainer.className = 'checkbox-grid';

                    items.forEach(tag => {
                        const label = document.createElement('label');
                        const isPositive = ['tích cực', 'sôi nổi', 'vui vẻ', 'hứng thú', 'tự tin', 'lạc quan', 'tập trung nghe giảng', 'chú ý bài học', 'tích cực phát biểu', 'hòa đồng', 'biết chia sẻ', 'giúp đỡ bạn bè', 'biết nghe lời', 'lễ phép', 'ngoan ngoãn'].includes(tag);
                        const isNegative = ['mệt mỏi', 'chán nản', 'trầm tính', 'tự ti', 'xấu hổ', 'ngại nói', 'sao nhãng', 'làm việc riêng', 'không tập trung', 'lơ là', 'nóng nảy', 'chưa hòa đồng', 'chưa vâng lời', 'phải nhắc nhở nhiều'].includes(tag);

                        label.className = `pill-checkbox ${isPositive ? 'positive' : ''} ${isNegative ? 'negative' : ''}`;
                        label.style.fontSize = '0.75rem';

                        const input = document.createElement('input');
                        input.type = 'checkbox';
                        input.value = tag;
                        const s = groupState.students[isBulk ? 0 : studentIndex];
                        if (s.attitudes.includes(tag)) input.checked = true;

                        input.onchange = (e) => {
                            const checked = e.target.checked;
                            const val = e.target.value;
                            if (isBulk) {
                                groupState.students.forEach(st => {
                                    if (checked) { if (!st.attitudes.includes(val)) st.attitudes.push(val); }
                                    else { st.attitudes = st.attitudes.filter(a => a !== val); }
                                });
                            } else {
                                const st = groupState.students[studentIndex];
                                if (checked) { if (!st.attitudes.includes(val)) st.attitudes.push(val); }
                                else { st.attitudes = st.attitudes.filter(a => a !== val); }
                            }
                        };
                        const span = document.createElement('span');
                        span.textContent = tag;
                        span.style.padding = '0.2rem 0.6rem';
                        label.appendChild(input);
                        label.appendChild(span);
                        pillContainer.appendChild(label);
                    });
                    col.appendChild(pillContainer);
                    grid.appendChild(col);
                }
                catDiv.appendChild(grid);
                attitudeGroupContainer.appendChild(catDiv);
            }
        }

        // --- Initialization ---
        renderStudentInputs();
        renderGroupKnowledge();
        renderGroupAttitude();

        // --- Event Listeners ---
        // Student Count
        studentCountInput.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            groupState.studentCount = val;
            studentCountDisplay.textContent = val;
            if (navBadge) navBadge.textContent = val;
            renderStudentInputs();
            renderGroupKnowledge();
            renderGroupAttitude();
        });

        // Mode Toggles
        document.querySelectorAll('input[name="know_mode"]').forEach(r => {
            r.addEventListener('change', (e) => {
                if (e.target.checked) {
                    groupState.knowledgeMode = e.target.value;
                    renderGroupKnowledge();
                }
            });
        });
        document.querySelectorAll('input[name="att_mode"]').forEach(r => {
            r.addEventListener('change', (e) => {
                if (e.target.checked) {
                    groupState.attitudeMode = e.target.value;
                    renderGroupAttitude();
                }
            });
        });
        document.querySelectorAll('input[name="school_level"]').forEach(r => {
            r.addEventListener('change', (e) => {
                if (e.target.checked) {
                    groupState.schoolLevel = e.target.value;
                    console.log("School Level changed to:", groupState.schoolLevel);
                }
            });
        });

        // Generator
        groupGenerateBtn.addEventListener('click', () => {
            const lessonContent = document.getElementById('groupLessonContent').value.trim();
            if (!lessonContent) {
                alert("Vui lòng nhập nội dung bài học!");
                return;
            }
            const prompts = [];

            const pronoun = groupState.schoolLevel === 'THCS' ? 'em' : 'con';
            const pronounInstruction = groupState.schoolLevel === 'THCS'
                ? "Dùng đại từ 'em' để gọi học sinh."
                : "Dùng đại từ 'con' để gọi học sinh.";

            for (let idx = 0; idx < groupState.studentCount; idx++) {
                const student = groupState.students[idx];
                const name = document.getElementById(`s${idx + 1}_name`)?.value.trim() || `Học sinh ${idx + 1}`;

                let criteriaText = "";
                if (groupState.includedCriteria.length > 0) {
                    criteriaText = groupState.includedCriteria.map(c => `- ${c}: ${student.scores[c]}/10`).join('\n');
                } else {
                    criteriaText = "- (Không có nhận xét về kiến thức)";
                }

                const attitudeText = student.attitudes.length > 0 ? student.attitudes.map(a => `- ${a}`).join('\n') : '- (Không ghi nhận đặc biệt)';

                const prompt = `
### Feedback cho học sinh: ${name}

Hãy đóng vai trò là một giáo viên tiếng Anh thân thiện, nhẹ nhàng và chuyên nghiệp. Dựa trên thông tin dưới đây, hãy viết một đoạn nhận xét ngắn gọn (khoảng 50-100 chữ) bằng tiếng Việt dành cho phụ huynh. Sử dụng từ ngữ đơn giản, dễ hiểu, tránh dùng từ chuyên ngành khó hiểu.
${pronounInstruction}

Thông tin:
- Tên: ${name}
- Bài học: ${lessonContent}

Kết quả (Thang 10):
${criteriaText}

Thái độ:
${attitudeText}

Yêu cầu output (Thân thiện, nhẹ nhàng, từ ngữ đơn giản, KHÔNG chào hỏi/động viên sáo rỗng, TUYỆT ĐỐI KHÔNG nhắc đến điểm số):
1. **Tiếp thu kiến thức**:
\`\`\`plaintext
[Nội dung nhận xét kiến thức cho ${name}]
\`\`\`

2. **Thái độ học tập**:
\`\`\`plaintext
[Nội dung nhận xét thái độ cho ${name}]
\`\`\`
`.trim();
                prompts.push(prompt);
            }

            groupPromptOutput.textContent = prompts.join('\n\n' + '='.repeat(40) + '\n\n');
            groupOutputSection.classList.remove('hidden');
            groupOutputSection.scrollIntoView({ behavior: 'smooth' });
        });

        if (groupCopyBtn) {
            groupCopyBtn.addEventListener('click', () => copyToClipboard(groupPromptOutput, groupCopyBtn));
        }

        // Refresh
        groupFabRefresh.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn làm mới tất cả thông tin nhóm (bao gồm nội dung bài học và danh sách học sinh)?')) {
                const lessonInput = document.getElementById('groupLessonContent');
                if (lessonInput) lessonInput.value = '';
                groupState.students = Array.from({ length: MAX_STUDENTS }, () => ({
                    name: '', scores: {}, attitudes: []
                }));
                groupState.students.forEach(s => { CRITERIA_LIST.forEach(c => s.scores[c] = 8); });

                groupState.studentCount = 4;
                const countInput = document.getElementById('studentCountInput');
                const countDisplay = document.getElementById('studentCountDisplay');
                if (countInput) countInput.value = 4;
                if (countDisplay) countDisplay.textContent = 4;
                if (navBadge) navBadge.textContent = 4;

                groupState.schoolLevel = 'TH';
                const levelTh = document.getElementById('level_th');
                if (levelTh) levelTh.checked = true;

                groupPromptOutput.textContent = '';
                groupOutputSection.classList.add('hidden');
                renderStudentInputs();
                renderGroupKnowledge();
                renderGroupAttitude();
            }
        });
    }


    // --- Shared Utilities ---
    document.querySelectorAll('input[type="range"]').forEach(attachSliderWheelEvent);

    const autoExpandTextareas = document.querySelectorAll('.auto-expand');
    autoExpandTextareas.forEach(textarea => {
        textarea.addEventListener('input', autoResizeTextarea);
        autoResizeTextarea({ target: textarea });
    });

}); // End DOMContentLoaded

// --- Global Utilities ---
function autoResizeTextarea(e) {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}
function attachSliderWheelEvent(slider) {
    const container = slider.parentElement;
    if (container) {
        container.classList.add('slider-interaction-area');
        container.addEventListener('wheel', (e) => {
            if (slider.disabled) return;
            e.preventDefault();
            const delta = Math.sign(e.deltaY) * -1;
            const currentVal = parseInt(slider.value);
            const min = parseInt(slider.min) || 0;
            const max = parseInt(slider.max) || 10;
            const step = parseInt(slider.step) || 1;
            let newVal = currentVal + (delta * step);
            if (newVal > max) newVal = max;
            if (newVal < min) newVal = min;
            if (newVal !== currentVal) {
                slider.value = newVal;
                slider.dispatchEvent(new Event('input'));
            }
        }, { passive: false });
    }
}

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
