(function () {
  const config = window.EVENT_CONFIG;

  if (!config) {
    console.error("행사 설정을 불러오지 못했습니다.");
    return;
  }

  const eventDate = new Date(`${config.date}T00:00:00+09:00`);
  const [year, month, day] = config.date.split("-").map(Number);
  const weekdayKo = new Intl.DateTimeFormat("ko-KR", {
    weekday: "long",
    timeZone: "Asia/Seoul",
  }).format(eventDate);
  const weekdayEn = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Asia/Seoul",
  })
    .format(eventDate)
    .toUpperCase();

  const event = {
    ...config,
    isoDate: `${config.date}T${config.startTime}:00+09:00`,
    dateLabel: `${year}년 ${month}월 ${day}일 ${weekdayKo}`,
    dateShort: `${month}월 ${day}일`,
    dateNumeric: config.date.replaceAll("-", "."),
    dayLabel: weekdayEn,
    time: `${config.startTime}–${config.endTime}`,
  };

  document.querySelectorAll("[data-event]").forEach((element) => {
    const key = element.dataset.event;

    if (key === "dday") {
      const eventStart = new Date(event.isoDate);
      const now = new Date();
      const remaining = Math.ceil((eventStart - now) / 86400000);

      if (remaining > 0) {
        element.textContent = `D-${remaining}`;
      } else if (remaining === 0) {
        element.textContent = "D-DAY";
      } else {
        element.textContent = event.capacity;
      }
      return;
    }

    if (event[key]) {
      element.textContent = event[key];
    }
  });

  const applicationForm = document.querySelector("#seminar-application-form");
  const submitTarget = document.querySelector(".submit-target");
  const successMessage = document.querySelector(".form-success");
  let formWasSubmitted = false;

  if (applicationForm) {
    applicationForm.action = event.googleFormAction;
    const eventDateField = applicationForm.querySelector("[data-google-date]");
    if (eventDateField) eventDateField.value = event.googleFormDateValue;

    applicationForm.addEventListener("submit", (submissionEvent) => {
      const errorMessage = applicationForm.querySelector(".form-error");

      if (!applicationForm.checkValidity()) {
        submissionEvent.preventDefault();
        applicationForm.classList.add("was-validated");
        if (errorMessage) errorMessage.hidden = false;
        applicationForm.querySelector(":invalid")?.focus();
        return;
      }

      formWasSubmitted = true;
      if (errorMessage) errorMessage.hidden = true;
      const submitButton = applicationForm.querySelector(".form-submit");
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.querySelector("span").textContent = "신청서를 전송하고 있습니다";
      }
    });
  }

  submitTarget?.addEventListener("load", () => {
    if (!formWasSubmitted || !applicationForm || !successMessage) return;
    applicationForm.hidden = true;
    successMessage.hidden = false;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
})();
