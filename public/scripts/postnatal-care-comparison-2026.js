const dataEl = document.getElementById("pncData");
const { questions, resultCopy } = JSON.parse(dataEl?.textContent || "{}");

const questionListEl = document.getElementById("pncQuestionList");
const resultTitleEl = document.getElementById("pncResultTitle");
const resultCopyEl = document.getElementById("pncResultCopy");
const resultCtaEl = document.getElementById("pncResultCta");

const answers = {};

function calculateResult(qs, ans) {
  const scores = { center: 0, helper: 0, hybrid: 0 };
  qs.forEach((q) => {
    const answer = ans[q.id];
    if (!answer) return;
    const target = answer === "yes" ? q.yesCareType : q.noCareType;
    scores[target] += q.weight;
  });
  const maxScore = Math.max(scores.center, scores.helper, scores.hybrid);
  if (scores.hybrid === maxScore && scores.hybrid > 0) return "hybrid";
  if (scores.center >= scores.helper) return "center";
  return "helper";
}

function renderResult() {
  const answeredCount = Object.keys(answers).length;
  if (answeredCount === 0) {
    if (resultTitleEl) resultTitleEl.textContent = "질문에 답하면 추천이 표시됩니다";
    if (resultCopyEl) resultCopyEl.textContent = "";
    if (resultCtaEl) resultCtaEl.style.display = "none";
    return;
  }

  const resultType = calculateResult(questions, answers);
  const copy = resultCopy[resultType];
  if (!copy) return;

  if (resultTitleEl) resultTitleEl.textContent = copy.title;
  if (resultCopyEl) resultCopyEl.textContent = copy.copy;
  if (resultCtaEl) {
    resultCtaEl.textContent = copy.cta;
    resultCtaEl.href = copy.href;
    resultCtaEl.style.display = "";
  }
}

function renderQuestions() {
  if (!questionListEl || !questions?.length) return;

  questionListEl.innerHTML = "";
  questions.forEach((q) => {
    const item = document.createElement("div");
    item.className = "pnc-question";

    const text = document.createElement("p");
    text.className = "pnc-question__text";
    text.textContent = q.question;

    const actions = document.createElement("div");
    actions.className = "pnc-question__actions";

    ["yes", "no"].forEach((val) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pnc-choice";
      btn.textContent = val === "yes" ? "예" : "아니오";
      btn.setAttribute("data-qid", q.id);
      btn.setAttribute("data-val", val);

      if (answers[q.id] === val) btn.classList.add("is-active");

      btn.addEventListener("click", () => {
        answers[q.id] = val;
        item.querySelectorAll(".pnc-choice").forEach((b) => {
          b.classList.toggle("is-active", b.getAttribute("data-val") === val);
        });
        renderResult();
      });

      actions.appendChild(btn);
    });

    item.appendChild(text);
    item.appendChild(actions);
    questionListEl.appendChild(item);
  });
}

function initFaq() {
  document.querySelectorAll(".pnc-faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".pnc-faq-item");
      if (!item) return;
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".pnc-faq-item.is-open").forEach((el) => el.classList.remove("is-open"));
      if (!isOpen) item.classList.add("is-open");
    });

    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

renderQuestions();
renderResult();
initFaq();
