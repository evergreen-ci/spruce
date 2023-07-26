const newMainlineCommitsUser = [
  {
    alt: "New UI preview image",
    description:
      "We designed this UI to make navigation faster and more intuitive. By default it highlights failed tasks, but you can customize this view with filters.",
    href: "https://app.tango.us/app/workflow/Evergreen--Onboarding-guide-for-the-new-project-health-page--7b74b28c80f448869a01730a450bc246",
    img: "mainline_commits/carousel_1_05_06.png",
    title: "Welcome to the new mainline commits experience!",
  },
  {
    description:
      "A graph at the top of the page gives you an overview of the project's health. You can toggle the graph between an absolute number  and percentage.",
    title: "Get a quick overview of your project's health",
    video: "mainline_commits/carousel_2_05_06.webm",
  },
  {
    description:
      "New status icons make it easier to differentiate between task statuses. You can find an expandable legend explaining what each icon represents.",
    href: "https://app.tango.us/app/workflow/Status-icon-behavior--1db9909b454f4800b05774fa408f2924",
    title: "Newly designed icons",
    video: "mainline_commits/carousel_3_05_06.webm",
  },
  {
    description:
      "Identifying the same task across multiple build variants is an important part of the workflow. When you hover over a task, we will display the name of the task and highlight that task across other commits.",
    href: "https://app.tango.us/app/workflow/Status-icon-behavior--1db9909b454f4800b05774fa408f2924",
    title: "New way to recognize patterns",
    video: "mainline_commits/carousel_4_05_06.webm",
  },
  {
    description:
      "Access task history from the task details page by clicking on the ‘See History’ button at the top of the page. You can also filter for specific test results by clicking see history on a test result. ",
    href: "https://app.tango.us/app/workflow/Task-History--23e6b3f043234a19988d6ab0a0729598",
    title: "Improved task history experience",
    video: "mainline_commits/carousel_5_05_06.webm",
  },
  {
    alt: "Build Variant History Page picture",
    description:
      "Selecting a Build Variant will direct you to the Build Variant History page, which shows tasks across a build variant over time.",
    href: "https://app.tango.us/app/workflow/Variant-History-fa73d48662f24e48842fc315130c483f",
    img: "mainline_commits/carousel_6_05_06.png",
    title: "New Build Variant History page",
  },
];

const newSpruceUser = [
  {
    alt: "my patches page",
    description:
      "We've made your patches workflow better by adding more filtering options, reducing load times, and improving the design.",
    img: "welcome_modal/mypatch_gif_06_10.gif",
    subtitle: "Discover your new and improved patches workflow!",
  },
  {
    alt: "Patch Page preview",
    description:
      "We've made it easier to navigate through your tasks and find the information you're looking for.",
    img: "welcome_modal/patch_gif_06_10.gif",
    subtitle: "We've also updated the patch page!",
  },
  {
    alt: "Switch back to old UI toggle",
    description:
      "We're still working every day to make this better, adding new features and new pages all the time. In case you want to opt out of the new UI and miss all the updates... navigate to your preferences to do so.",
    img: "welcome_modal/newui_gif_06_10.gif",
    subtitle:
      "We really hope you enjoy the new UI, but just in case you miss the old Evergreen…",
  },
];

export { newMainlineCommitsUser, newSpruceUser };
