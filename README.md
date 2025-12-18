# edupia-feedback-prompt-generator
A Feedback Prompt Generator

## Description
This is a feedback prompt generator that create prompt to feed to an LLM after and create a feedback for a student. The prompt is created based on the student's performance in a lesson. The feedbacks are meant for the parents to read so the app and the form are in Vietnamese.

The app is web based (html, css, js) and uses input from the user to generate the form. Using the form, users (teachers) can paste that into any LLM of choice to generate a feedback for the student. 

### Form requirements
- Markdown format

### Form Fields
1. A text input field for student's name
2. A large text input field for lesson content called "Nội dung bài học"
3. "## Tiếp thu kiến thức" with sliders (1 to 10, with 10 as excellence) for different criteria namely "Từ vựng", "Ngữ pháp", "Phát âm", "Ngữ âm", "Đọc hiểu", "Nghe hiểu" and "Phản xạ". In front of each slider, provide a checkbox to include the corresponding criteria in the form or not.
4. "## Thái độ học tập", under which will have the following criteria with different catergoriest to choose from 
```
### Năng lượng/ tinh thần học tập trên lớp
- [ ] tích cực, 
- [ ] sôi nổi, 
- [ ] vui vẻ, 
- [ ] hứng thú, 
- [ ] tự tin, 
- [ ] lạc quan, 
- [ ] mệt mỏi, 
- [ ] chán nản, 
- [ ] trầm tính, 
- [ ] tự ti, 
- [ ] xấu hổ, 
- [ ] ngại nói…
### Khả năng tập trung
- [ ] tập trung nghe giảng, 
- [ ] chú ý bài học, 
- [ ] tích cực phát biểu, 
- [ ] sao nhãng, 
- [ ] làm việc riêng, 
- [ ] không tập trung, 
- [ ] lơ là
### Thái độ trong các hoạt động với bạn học
- [ ] hòa đồng, 
- [ ] biết chia sẻ, 
- [ ] giúp đỡ bạn bè, 
- [ ] nóng nảy, 
- [ ] chưa hòa đồng, 
- [ ] chưa biết tương tác với bạn
### Thái độ với giáo viên
- [ ] biết nghe lời, 
- [ ] lễ phép, 
- [ ] ngoan ngoãn, 
- [ ] chưa vâng lời, 
- [ ] còn để thầy cô nhắc nhở nhiều
```

### Requirements set for the LLM
1. Output a compact, precise and clear single markdown paragraph feedback for 2 specific criteria, namely "Tiếp thu kiến thức" and "Thái độ học tập". 
2. Make sure to put "Tiếp thu kiến thức" and "Thái độ học tập" inside 2 separate code brackets for the teacher to easily copy and paste them.
3. The feedback should be in Vietnamese
4. Refer to the student as "em" or their name
5. Avoid using the score (such as "8/10") in the output feedback to sound more natural and less "automated". Just give the evaluation based on the criteria. 

```
html, body {
  background-color: #f0f2f5;
}

/* ==== Global Showcase Styles ==== */
.toggle-showcase-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}
.toggle-section-title {
  font-size: 1.5em;
  color: #333;
  margin-top: 30px;
  margin-bottom: 15px;
  padding-bottom: 5px;

}
.toggle-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Space between toggles */
  align-items: center;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

/* ==== Base Toggle Switch Styles ==== */
.toggle-switch {
  position: relative;
  display: inline-block;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent; /* For mobile */
}

.toggle-switch input[type="checkbox"] {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.toggle-switch .slider {
  position: absolute;
  background-color: #ccc; /* Default off background */
  transition: .4s;
  box-shadow: inset 0 0 2px rgba(0,0,0,0.1);
}

.toggle-switch .slider::before {
  position: absolute;
  content: "";
  background-color: white;
  transition: .4s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

/* ==== Style Variation 1: Classic Rounded Toggles (ts-rounded) ==== */
.ts-rounded {
  width: 60px;
  height: 34px;
}
.ts-rounded .slider {
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 34px;
}
.ts-rounded .slider::before {
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  border-radius: 50%;
}
.ts-rounded input:checked + .slider::before {
  transform: translateX(26px);
}

/* ==== Style Variation 2: Modern Square Toggles (ts-square) ==== */
.ts-square {
  width: 50px;
  height: 28px;
}
.ts-square .slider {
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 4px;
}
.ts-square .slider::before {
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  border-radius: 3px;
}
.ts-square input:checked + .slider::before {
  transform: translateX(22px);
}

/* ==== Style Variation 3: Toggles with Text (ts-text) ==== */
.ts-text {
  width: 70px; /* Wider for text */
  height: 30px;
}
.ts-text .slider {
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 30px;
  font-size: 12px;
  font-weight: bold;
  line-height: 30px;
}
.ts-text .slider::before {
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  border-radius: 50%;
}
/* Text inside slider - one for ON, one for OFF */
.ts-text .slider::after, .ts-text input:checked + .slider::after {
  position: absolute;
  color: white;
  transition: opacity 0.2s ease, transform 0.4s ease;
}
/* OFF text (default) */
.ts-text .slider::after {
  content: "OFF";
  right: 10px;
  opacity: 1;
  transform: translateX(0);
}
/* ON text (when checked) */
.ts-text input:checked + .slider::after {
  content: "ON";
  left: 10px;
  right: auto;
  opacity: 1;
  transform: translateX(0);
}
/* Hide OFF text when checked and ON text when not checked */
.ts-text input:checked + .slider::after {
  /* This selector makes OFF text disappear */
}
.ts-text input:not(:checked) + .slider::after {
  /* If we need to style ON text when not checked (e.g. to hide it) */
}
/* Simpler: change opacity and only one pseudo element for text */
.ts-text .slider::after {
    content: "OFF"; right: 10px; color: #fff; opacity: 1; 
}
.ts-text input:checked + .slider::after {
    content: "ON"; left: 10px; right: auto; opacity: 1;
}
.ts-text input:checked + .slider::before {
  transform: translateX(40px); /* Adjust for wider toggle */
}

/* ==== Style Variation 4: Slim Design Toggles (ts-slim) ==== */
.ts-slim {
  width: 48px;
  height: 24px;
}
.ts-slim .slider {
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 24px;
}
.ts-slim .slider::before {
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.ts-slim input:checked + .slider::before {
  transform: translateX(24px);
}

/* ==== Color Variations ==== */
/* Default OFF color for all is #ccc (from .slider) */

/* Blue */
.ts-blue input:checked + .slider { background-color: #2196F3; }
.ts-text.ts-blue input:not(:checked) + .slider { background-color: #7bbcf0; } /* Lighter blue for OFF text */

/* Green */
.ts-green input:checked + .slider { background-color: #4CAF50; }
.ts-text.ts-green input:not(:checked) + .slider { background-color: #8bcda6; }

/* Red */
.ts-red input:checked + .slider { background-color: #f44336; }
.ts-text.ts-red input:not(:checked) + .slider { background-color: #f89e98; }

/* Orange */
.ts-orange input:checked + .slider { background-color: #ff9800; }
.ts-text.ts-orange input:not(:checked) + .slider { background-color: #ffc966; }

/* Grey */
.ts-grey input:checked + .slider { background-color: #607d8b; } /* Darker grey for ON */
.ts-text.ts-grey input:not(:checked) + .slider { background-color: #90a4ae; }

/* Focus styles for accessibility */
.toggle-switch input:focus-visible + .slider {
  outline: 2px solid #007bff; /* Default focus outline color */
  outline-offset: 2px;
}
.ts-blue input:focus-visible + .slider { outline-color: #64b5f6; }
.ts-green input:focus-visible + .slider { outline-color: #81c784; }
.ts-red input:focus-visible + .slider { outline-color: #e57373; }
.ts-orange input:focus-visible + .slider { outline-color: #ffb74d; }
.ts-grey input:focus-visible + .slider { outline-color: #b0bec5; }
```