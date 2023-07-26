import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "test_utils";
import WelcomeModal from "./WelcomeModal";

describe("welcomeModal", () => {
  beforeEach(() => {
    Object.defineProperty(global.window.HTMLMediaElement.prototype, "play", {
      configurable: true,
      // Define the property getter
      get() {
        setTimeout(() => this.onloadeddata && this.onloadeddata());
        return () => {};
      },
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("displays an image", () => {
    render(
      <MockedProvider>
        <WelcomeModal
          carouselCards={[
            {
              alt: "evg-logo",
              description: "A Description 1",
              img: "test_img/logo.png",
              subtitle: "A Subtitle",
              title: "Slide 1",
            },
          ]}
          param="spruceV1"
        />
      </MockedProvider>
    );

    expect(screen.queryByDataCy("carousel-image")).toBeVisible();
  });

  // mock video play function
  it("displays an video on a video slide", () => {
    render(
      <MockedProvider>
        <WelcomeModal
          carouselCards={[
            {
              description: "A Description 1",
              subtitle: "A Subtitle",
              title: "Slide 1",
              video: "test_img/video.webm",
            },
          ]}
          param="spruceV1"
        />
      </MockedProvider>
    );
    expect(screen.queryByDataCy("carousel-video")).toBeVisible();
  });

  it("clicking the pagination buttons change the slides", async () => {
    render(
      <MockedProvider>
        <WelcomeModal
          carouselCards={[
            {
              description: "A Description 1",
              img: "test_img/logo.png",
              subtitle: "A Subtitle",
              title: "Slide 1",
            },
            {
              description: "A Description 2",
              img: "test_img/logo.png",
              title: "Slide 2",
            },
          ]}
          param="spruceV1"
        />
      </MockedProvider>
    );
    expect(screen.getByText("Slide 1")).toBeVisible();
    expect(screen.queryByDataCy("carousel-dot-1")).toBeVisible();
    screen.queryByDataCy("carousel-dot-1").click();
    await waitFor(() => {
      expect(screen.getByText("Slide 2")).toBeVisible();
    });
    screen.queryByDataCy("carousel-dot-0").click();
    await waitFor(() => {
      expect(screen.getByText("Slide 1")).toBeVisible();
    });
  });
});
