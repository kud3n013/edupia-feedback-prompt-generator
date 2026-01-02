"use client";

import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";

export default function LessonPage() {
    const [atmosphereChecked, setAtmosphereChecked] = useState(true);
    const [atmosphereValue, setAtmosphereValue] = useState("Sôi nổi");

    const [progressChecked, setProgressChecked] = useState(true);
    const [progressValue, setProgressValue] = useState("Bình thường");

    const [lateChecked, setLateChecked] = useState(false);
    const [lateValue, setLateValue] = useState("");

    const [reminders, setReminders] = useState<string[]>([]);
    const [output, setOutput] = useState("");
    const [showOutput, setShowOutput] = useState(false);
    const [copyBtnText, setCopyBtnText] = useState("Copy to Clipboard");

    const handleReminderChange = (value: string) => {
        setReminders((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const generateFeedback = () => {
        let sentences = [];

        // Atmosphere Mapping
        const atmosphereMap: Record<string, string> = {
            "Sôi nổi": "sôi nổi, các con hào hứng phát biểu xây dựng bài",
            "Trầm lặng": "hơi trầm, các con cần tương tác nhiều hơn",
        };

        // Progress Mapping
        const progressMap: Record<string, string> = {
            "Bình thường": "tốt đẹp, các con đều hiểu bài",
            "Trễ": "kết thúc muộn hơn dự kiến một chút",
            "Sớm": "kết thúc sớm hơn dự kiến",
        };

        if (atmosphereChecked) {
            const text = atmosphereMap[atmosphereValue] || atmosphereValue;
            sentences.push(`Không khí lớp học ${text}`);
        }

        if (progressChecked) {
            const text = progressMap[progressValue] || progressValue;
            sentences.push(`Buổi học diễn ra ${text}`);
        }

        if (lateChecked && lateValue.trim()) {
            sentences.push(`Bạn ${lateValue.trim()} vào muộn`);
        }

        let part1Text = "";
        if (sentences.length > 0) {
            part1Text = "1. " + sentences.join(". ") + ".";
        }

        let part2Text = "";
        if (reminders.length > 0) {
            part2Text = `2. PH nhớ nhắc các em hoàn thành ${reminders.join(", ")}.`;
        }

        const finalOutput = [part1Text, part2Text].filter((t) => t).join("\n\n");

        if (!finalOutput) {
            alert("Vui lòng chọn ít nhất một thông tin để tạo feedback!");
            return;
        }

        setOutput(finalOutput);
        setShowOutput(true);

        // Smooth scroll to output (optional, browser handles it often)
        setTimeout(() => {
            document.getElementById("output-section")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleCopy = () => {
        copyToClipboard(output, () => {
            setCopyBtnText("Copied!");
            setTimeout(() => setCopyBtnText("Copy to Clipboard"), 2000);
        });
    };

    return (
        <div className="animate-fade-in space-y-8">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    generateFeedback();
                }}
            >
                <section className="glass-panel p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-main)] border-b-2 border-indigo-500/10 pb-2">
                        1. Thông tin buổi học
                    </h2>

                    <div className="space-y-6">
                        {/* Atmosphere */}
                        <div className="flex flex-wrap items-center gap-4">
                            <label className="flex items-center cursor-pointer min-w-[30px]">
                                <input
                                    type="checkbox"
                                    checked={atmosphereChecked}
                                    onChange={(e) => setAtmosphereChecked(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 accent-[var(--primary-color)] focus:ring-[var(--primary-color)] cursor-pointer"
                                />
                            </label>
                            <label className="min-w-[140px] font-medium">Không khí lớp học</label>
                            <select
                                value={atmosphereValue}
                                onChange={(e) => setAtmosphereValue(e.target.value)}
                                disabled={!atmosphereChecked}
                                className="flex-1 p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] disabled:opacity-50 transition-all shadow-sm"
                            >
                                <option value="Sôi nổi">Sôi nổi</option>
                                <option value="Trầm lặng">Trầm lặng</option>
                            </select>
                        </div>

                        {/* Progress */}
                        <div className="flex flex-wrap items-center gap-4">
                            <label className="flex items-center cursor-pointer min-w-[30px]">
                                <input
                                    type="checkbox"
                                    checked={progressChecked}
                                    onChange={(e) => setProgressChecked(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 accent-[var(--primary-color)] focus:ring-[var(--primary-color)] cursor-pointer"
                                />
                            </label>
                            <label className="min-w-[140px] font-medium">Buổi học diễn ra</label>
                            <select
                                value={progressValue}
                                onChange={(e) => setProgressValue(e.target.value)}
                                disabled={!progressChecked}
                                className="flex-1 p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] disabled:opacity-50 transition-all shadow-sm"
                            >
                                <option value="Bình thường">Bình thường</option>
                                <option value="Trễ">Trễ</option>
                                <option value="Sớm">Sớm</option>
                            </select>
                        </div>

                        {/* Late */}
                        <div className="flex flex-wrap items-center gap-4">
                            <label className="flex items-center cursor-pointer min-w-[30px]">
                                <input
                                    type="checkbox"
                                    checked={lateChecked}
                                    onChange={(e) => setLateChecked(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 accent-[var(--primary-color)] focus:ring-[var(--primary-color)] cursor-pointer"
                                />
                            </label>
                            <label className="min-w-[140px] font-medium">Bạn vào muộn</label>
                            <input
                                type="text"
                                value={lateValue}
                                onChange={(e) => setLateValue(e.target.value)}
                                disabled={!lateChecked}
                                placeholder="Tên học sinh..."
                                className="flex-1 p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] disabled:opacity-50 transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </section>

                <section className="glass-panel p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-main)] border-b-2 border-indigo-500/10 pb-2">
                        2. Nhắc nhở phụ huynh
                    </h2>
                    <p className="mb-4 text-[var(--text-secondary)] text-sm">
                        PH nhớ nhắc các em hoàn thành:
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {["BTVN", "Bài thi tháng", "Bài tập nói"].map((item) => (
                            <label
                                key={item}
                                className={`inline-block px-4 py-2 rounded-full border cursor-pointer transition-all select-none text-sm ${reminders.includes(item)
                                    ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)] shadow-md"
                                    : "bg-white/50 border-gray-200/10 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-600"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={reminders.includes(item)}
                                    onChange={() => handleReminderChange(item)}
                                />
                                {item}
                            </label>
                        ))}
                    </div>
                </section>

                <div className="flex justify-center mb-8">
                    <button
                        type="submit"
                        className="px-8 py-3 rounded-lg bg-[var(--primary-color)] text-white font-semibold transform hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] shadow-lg hover:shadow-xl transition-all"
                    >
                        Tạo Feedback
                    </button>
                </div>
            </form>

            {showOutput && (
                <section id="output-section" className="glass-panel p-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Generated Lesson Report</h2>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className={`px-4 py-2 rounded-lg border border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-medium transition-colors ${copyBtnText === "Copied!" ? "!bg-[var(--primary-color)] !text-white" : ""
                                }`}
                        >
                            {copyBtnText}
                        </button>
                    </div>
                    <pre className="bg-[#1e1e2e] text-[#e2e8f0] p-6 rounded-lg overflow-x-auto font-mono text-sm whitespace-pre-wrap border border-gray-700">
                        {output}
                    </pre>
                </section>
            )}
        </div>
    );
}
