const jobsContainer = document.querySelector(".jobs");
const jobs = [];
const tagsContainer = document.querySelector(".tags-container");
const tags = [];
const tagsParent = document.querySelector(".tags");
const clear = document.querySelector(".clear");

const getJobs = async () => {
  const request = await fetch("data.json");
  const response = await request.json();
  console.log(response);
  jobs.push(...response);
  tagsCheker();
  displayJobs(response);
};

// to show and hide the tags container
const tagsCheker = () => {
  if (tags.length) {
    tagsParent.classList.remove("hide");
  } else {
    tagsParent.classList.add("hide");
  }
};

const displayJobs = (arr = []) => {
  jobsContainer.innerHTML = "";
  arr.forEach((job, i) => {
    jobsContainer.innerHTML += `
  <div class="job flex flex-col ${job.featured ? "featured" : ""}">
    <img src=${job.logo} alt="${job.company}" />
    <div class="about-job flex flex-col">
      <div class="title flex items-center">
        <span>${job.company}</span>
        ${
          job.new || job.featured
            ? `<div class="status flex">
              <span class="${job.new ? "new" : ""}">new!</span>
              <span class="${job.featured ? "featured" : ""}">featured</span>
            </div>`
            : ""
        }
      </div>
      <p class="role">${job.position}</p>
      <div class="location-time flex">
        <span>${job.postedAt}</span>
        <span>${job.contract}</span>
        <span>${job.location}</span>
      </div>
    </div>
    <div class="skills flex">
    </div>
    </div>`;
    [job.role, job.level, ...job.languages, ...job.tools].forEach((lang) => {
      document.querySelectorAll(".skills")[
        i
      ].innerHTML += `<span>${lang}</span>`;
      document
        .querySelectorAll(".skills > span")
        .forEach((skill) => skill.addEventListener("click", filterSkills));
    });
  });
};

const displayTags = (arr = []) => {
  tagsContainer.innerHTML = "";
  arr.forEach((tag, i) => {
    tagsContainer.innerHTML += `
    <div class="tag flex">
      <span>${tag}</span>
      <div class="delete flex justify-center items-center">
        <img src="./images/icon-remove.svg" alt="remove" />
      </div>
    </div>
    `;
    document.querySelectorAll(".delete").forEach((button, index) => {
      button.addEventListener("click", () => {
        tags.splice(index, 1);
        const filterdJobs = jobs.filter((job) =>
          tags.every((tag) =>
            [job.role, job.level, ...job.languages, ...job.tools].includes(tag)
          )
        );
        tagsCheker();
        displayJobs(filterdJobs);
        displayTags(tags);
      });
    });
  });
};

const filterSkills = (e) => {
  const skill = e.target.textContent;
  tags.includes(skill) ? "" : tags.push(skill);
  const filterdJobs = jobs.filter((job) =>
    tags.every((tag) =>
      [job.role, job.level, ...job.languages, ...job.tools].includes(tag)
    )
  );
  tagsCheker();
  displayJobs(filterdJobs);
  displayTags(tags);
};

const clearTags = () => {
  tags.splice(0, tags.length);
  tagsCheker();
  displayJobs(jobs);
  displayTags(tags);
};

clear.addEventListener("click", clearTags);
addEventListener("load", getJobs);
