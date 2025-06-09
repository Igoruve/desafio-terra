import { useState } from "react";

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Do I need to register to use the app?",
      answer:
        "Yes. To access the features, you must be registered and logged in. Simply tap “Log In,” enter your credentials, and once you’re in, you can use all the app’s advanced features.",
    },
    {
      question: "How do I access the form to report an issue or send feedback?",
      answer:
        "Once you are registered and logged in, the projects page will open automatically. There you can click on the plus icon to access the issue-reporting form. You can select the type of issue and submit your report.",
    },
    {
      question: "Do I need to be registered to access the form?",
      answer:
        "Yes. Only users with an active account can access the issue-reporting form.",
    },
    {
      question: "What should I do first in the form?",
      answer:
        "First, select the type of issue. In the dropdown menu, choose the category that best describes your problem, such as “Technical Error” or “Design Issue.”",
    },
    {
      question: "How should I correctly describe my issue or feedback?",
      answer: `In the “Description” or “Comments” field, include all necessary information so we can reproduce and fix the problem. Specifically:

        - Expected behavior vs. actual behavior: Briefly explain what should have happened (for example, text should have resized correctly or the menu should display full-screen) and what you actually saw (overflowing text, misaligned elements, incorrect copy, etc.).

        - Screen, section, or function affected and preceding steps: Indicate which part of the app the error appeared in (for example, “on the Home screen,” “when opening the side menu,” or “in the registration form”). Describe step by step what you did just before the issue occurred so that we can replicate it.

        - Device, operating system, and browser: Especially for responsive design issues, specify your device model (for example, “iPhone 12,” “Samsung Galaxy S10”), the operating system version (iOS 17, Android 12), and the browser (Safari, Chrome) where you noticed the error. This helps identify whether it’s a problem specific to a certain screen size or platform.

        - Examples of incorrect text or copy (if applicable): If the issue is related to content (poorly written text, typos, confusing messages), copy the exact snippet you believe is wrong and indicate what the ideal correction would be.

        - Providing precise details will help us locate the cause faster and fix both responsive and copy errors.`,
    },
    {
      question: "Can I add an image to the report? How do I do it?",
      answer: `Yes. To attach a screenshot or photo:

        - Tap the “Attach Image” icon within the form.

        - Select the image from your gallery or take a new photo at that moment.

        The image will help the support team better understand the problem you are reporting.`,
    },
    {
      question: "What happens once I fill in all the fields?",
      answer:
        "After you have selected the issue type, written the description, and optionally added an image, tap the “Submit” button. You will see an on-screen confirmation indicating that your report has been received.",
    },
    {
      question: "Where can I find the terms and conditions?",
      answer:
        "In the app, go to “Settings” → “Terms and Conditions” to view the full document. It is also available on our website under the “Legal” section.",
    },
    {
      question: "Can I use the app in multiple languages?",
      answer: "Currently, the app is only available in English.",
    },
  ];

  const renderAnswer = (text) => {
    const lines = text.split("\n").map((line) => line.trim());

    const elements = [];
    let listItems = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul
            className="list-disc list-inside mt-2 mb-4 text-base md:text-lg lg:text-xl"
            key={elements.length}
          >
            {listItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line) => {
      if (line.startsWith("- ")) {
        listItems.push(line.slice(2).trim());
      } else if (line === "") {
        flushList();
      } else {
        flushList();
        elements.push(
          <p
            className="mt-2 text-base md:text-lg lg:text-xl"
            key={elements.length}
          >
            {line}
          </p>
        );
      }
    });

    flushList();

    return elements;
  };

  return (
    <section className="px-6 py-8 text-black max-w-3xl mx-auto mt-24">
      {faqs.map((faq, index) => (
        <div key={index} className="pb-8 mb-8 border-b-3 border-black">
          <div
            className="flex flex-row justify-between cursor-pointer items-center"
            onClick={() => handleExpand(index)}
          >
            <h3 className="font-bold text-lg md:text-xl lg:text-2xl">
              {faq.question}
            </h3>
            <img src="/ArrowDown.svg" alt="" />
          </div>
          {expandedIndex === index && renderAnswer(faq.answer)}
        </div>
      ))}
    </section>
  );
};

export default FAQ;
