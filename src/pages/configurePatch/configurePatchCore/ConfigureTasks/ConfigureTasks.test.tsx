import { render, screen, userEvent } from "test_utils";
import ConfigureTasks from ".";

describe("configureTasks", () => {
  describe("tasks and build variants", () => {
    it("should render all tasks from a single build variant", () => {
      const selectedBuildVariants = ["ubuntu2004"];
      const setSelectedBuildVariantTasks = jest.fn();
      render(
        <ConfigureTasks
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
          }}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          selectableAliases={[]}
          selectedAliases={{}}
          totalSelectedTaskCount={0}
          aliasCount={0}
          childPatches={[]}
          activated={false}
          setSelectedAliases={() => {}}
        />,
      );
      expect(screen.queryAllByDataCy("task-checkbox")).toHaveLength(2);
      expect(screen.getByText("compile")).toBeInTheDocument();
      expect(screen.getByText("test")).toBeInTheDocument();
    });
    it("should render all unique tasks from a multiple build variants", () => {
      const selectedBuildVariants = ["ubuntu2004", "ubuntu1804"];
      const setSelectedBuildVariantTasks = jest.fn();
      render(
        <ConfigureTasks
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { e2e: false, lint: false },
          }}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          selectableAliases={[]}
          selectedAliases={{}}
          totalSelectedTaskCount={0}
          aliasCount={0}
          childPatches={[]}
          activated={false}
          setSelectedAliases={() => {}}
        />,
      );
      expect(screen.queryAllByDataCy("task-checkbox")).toHaveLength(4);
      expect(screen.getByText("compile")).toBeInTheDocument();
      expect(screen.getByText("test")).toBeInTheDocument();
      expect(screen.getByText("e2e")).toBeInTheDocument();
      expect(screen.getByText("lint")).toBeInTheDocument();
    });
    it("should deduplicate tasks from multiple build variants", () => {
      const selectedBuildVariants = ["ubuntu2004", "ubuntu1804"];
      const setSelectedBuildVariantTasks = jest.fn();
      render(
        <ConfigureTasks
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: true, test: true },
            ubuntu1804: { compile: true, lint: true },
          }}
          totalSelectedTaskCount={3}
          aliasCount={0}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          selectableAliases={[]}
          selectedAliases={{}}
          childPatches={[]}
          activated={false}
          setSelectedAliases={() => {}}
        />,
      );
      expect(screen.queryAllByDataCy("task-checkbox")).toHaveLength(3);
      expect(screen.getByText("compile")).toBeInTheDocument();
      expect(screen.getByText("test")).toBeInTheDocument();
      expect(screen.getByText("lint")).toBeInTheDocument();
    });
    it("should render an indeterminate checkbox if some tasks are selected in one variant but not another", () => {
      const selectedBuildVariants = ["ubuntu2004", "ubuntu1804"];
      const setSelectedBuildVariantTasks = jest.fn();
      render(
        <ConfigureTasks
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: true, lint: false },
          }}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          selectableAliases={[]}
          selectedAliases={{}}
          totalSelectedTaskCount={1}
          aliasCount={0}
          childPatches={[]}
          activated={false}
          setSelectedAliases={() => {}}
        />,
      );
      const checkbox = screen.getByLabelText("compile");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBePartiallyChecked();
    });
    it("selecting a task should call setSelectedBuildVariantTasks with the correct arguments selecting only that task", async () => {
      const user = userEvent.setup();
      const selectedBuildVariants = ["ubuntu2004"];
      const setSelectedBuildVariantTasks = jest.fn();
      render(
        <ConfigureTasks
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
          }}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          selectableAliases={[]}
          selectedAliases={{}}
          totalSelectedTaskCount={0}
          aliasCount={0}
          childPatches={[]}
          activated={false}
          setSelectedAliases={() => {}}
        />,
      );
      const checkbox = screen.getByLabelText("compile");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
      expect(setSelectedBuildVariantTasks).not.toHaveBeenCalled();
      await user.click(screen.getByText("compile"));
      expect(setSelectedBuildVariantTasks).toHaveBeenCalledWith({
        ubuntu2004: { compile: true, test: false },
      });
    });
    it("selecting all tasks should call setSelectedBuildVariantTasks with the correct arguments selecting all of the visible tasks in one variant", async () => {
      const user = userEvent.setup();
      const selectedBuildVariants = ["ubuntu2004"];
      const setSelectedBuildVariantTasks = jest.fn();
      render(
        <ConfigureTasks
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: false, lint: false },
          }}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          selectableAliases={[]}
          selectedAliases={{}}
          totalSelectedTaskCount={0}
          aliasCount={0}
          childPatches={[]}
          activated={false}
          setSelectedAliases={() => {}}
        />,
      );
      const checkbox = screen.getByLabelText(
        "Select all tasks in this variant",
      );
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
      expect(setSelectedBuildVariantTasks).not.toHaveBeenCalled();
      await user.click(screen.getByText("Select all tasks in this variant"));
      expect(setSelectedBuildVariantTasks).toHaveBeenCalledWith({
        ubuntu2004: { compile: true, test: true },
        ubuntu1804: { compile: false, lint: false },
      });
    });
    it("selecting a deduplicated task should call setSelectedBuildVariantTasks selecting the task in all variants", async () => {
      const user = userEvent.setup();
      const selectedBuildVariants = ["ubuntu2004", "ubuntu1804"];
      const setSelectedBuildVariantTasks = jest.fn();
      render(
        <ConfigureTasks
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: false, lint: false },
          }}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          selectableAliases={[]}
          selectedAliases={{}}
          totalSelectedTaskCount={0}
          aliasCount={0}
          childPatches={[]}
          activated={false}
          setSelectedAliases={() => {}}
        />,
      );
      const checkbox = screen.getByLabelText("compile");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
      expect(setSelectedBuildVariantTasks).not.toHaveBeenCalled();
      await user.click(screen.getByText("compile"));
      expect(setSelectedBuildVariantTasks).toHaveBeenCalledWith({
        ubuntu2004: { compile: true, test: false },
        ubuntu1804: { compile: true, lint: false },
      });
    });
    it("selecting all tasks should call setSelectedBuildVariantTasks with the correct arguments selecting all of the visible tasks in multiple variants", async () => {
      const user = userEvent.setup();
      const selectedBuildVariants = ["ubuntu2004", "ubuntu1804"];
      const setSelectedBuildVariantTasks = jest.fn();
      render(
        <ConfigureTasks
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: false, lint: false },
          }}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          selectableAliases={[]}
          selectedAliases={{}}
          totalSelectedTaskCount={0}
          aliasCount={0}
          childPatches={[]}
          activated={false}
          setSelectedAliases={() => {}}
        />,
      );
      const checkbox = screen.getByLabelText(
        "Select all tasks in these variants",
      );
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
      expect(setSelectedBuildVariantTasks).not.toHaveBeenCalled();
      await user.click(screen.getByText("Select all tasks in these variants"));
      expect(setSelectedBuildVariantTasks).toHaveBeenCalledWith({
        ubuntu2004: { compile: true, test: true },
        ubuntu1804: { compile: true, lint: true },
      });
    });
    it("applying a search should filter the tasks", async () => {
      const user = userEvent.setup();
      const selectedBuildVariants = ["ubuntu2004", "ubuntu1804"];
      render(
        <ConfigureTasks
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: false, lint: false },
          }}
          setSelectedBuildVariantTasks={() => {}}
          selectableAliases={[]}
          selectedAliases={{}}
          totalSelectedTaskCount={0}
          aliasCount={0}
          childPatches={[]}
          activated={false}
          setSelectedAliases={() => {}}
        />,
      );

      await user.type(screen.getByDataCy("task-filter-input"), "compile");
      expect(screen.queryAllByDataCy("task-checkbox")).toHaveLength(1);
      const checkbox = screen.getByLabelText("compile");
      expect(checkbox).toBeInTheDocument();
    });
  });
  describe("downstream tasks and aliases", () => {
    it("should render alias variant and tasks if they are selected", () => {
      const selectedBuildVariants = ["parsley"];
      const setSelectedBuildVariantTasks = jest.fn();
      const setSelectedAliases = jest.fn();
      render(
        <ConfigureTasks
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: true, lint: false },
          }}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          selectableAliases={[
            {
              alias: "parsley",
              childProjectIdentifier: "Parsley",
              childProjectId: "parsley",
              variantsTasks: [
                {
                  name: "ubuntu2204-large",
                  tasks: ["e2e_test"],
                },
              ],
            },
          ]}
          selectedAliases={{}}
          totalSelectedTaskCount={3}
          aliasCount={0}
          childPatches={[]}
          activated={false}
          setSelectedAliases={setSelectedAliases}
        />,
      );
      expect(screen.getByText("ubuntu2204-large")).toBeInTheDocument();
      const checkbox = screen.getByLabelText("e2e_test");
      expect(checkbox).toBeInTheDocument();
    });
    it("should disable individual task checkboxes for disabled aliases", () => {
      const selectedBuildVariants = ["parsley"];
      const setSelectedBuildVariantTasks = jest.fn();
      const setSelectedAliases = jest.fn();
      render(
        <ConfigureTasks
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: true, lint: false },
          }}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          selectableAliases={[
            {
              alias: "parsley",
              childProjectIdentifier: "Parsley",
              childProjectId: "parsley",
              variantsTasks: [
                {
                  name: "ubuntu2204-large",
                  tasks: ["e2e_test"],
                },
              ],
            },
          ]}
          selectedAliases={{}}
          totalSelectedTaskCount={1}
          aliasCount={0}
          childPatches={[]}
          activated={false}
          setSelectedAliases={setSelectedAliases}
        />,
      );
      expect(screen.getByText("ubuntu2204-large")).toBeInTheDocument();
      const checkbox = screen.getByLabelText("e2e_test");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeDisabled();
    });
    it("should automatically select all tasks for an alias if the alias is selected", () => {
      const selectedBuildVariants = ["parsley"];
      const setSelectedBuildVariantTasks = jest.fn();
      const setSelectedAliases = jest.fn();
      render(
        <ConfigureTasks
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: true, lint: false },
          }}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          selectableAliases={[
            {
              alias: "parsley",
              childProjectIdentifier: "Parsley",
              childProjectId: "parsley",
              variantsTasks: [
                {
                  name: "ubuntu2204-large",
                  tasks: ["e2e_test"],
                },
              ],
            },
          ]}
          selectedAliases={{ parsley: true }}
          totalSelectedTaskCount={1}
          aliasCount={1}
          childPatches={[]}
          activated={false}
          setSelectedAliases={setSelectedAliases}
        />,
      );
      expect(screen.getByText("ubuntu2204-large")).toBeInTheDocument();
      const checkbox = screen.getByLabelText("e2e_test");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeChecked();
    });
    it("should render both alias name and normal tasks if both are selected", () => {
      const selectedBuildVariants = ["parsley", "ubuntu2004"];
      const setSelectedBuildVariantTasks = jest.fn();
      const setSelectedAliases = jest.fn();
      render(
        <ConfigureTasks
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: false, lint: false },
          }}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          selectableAliases={[
            {
              alias: "parsley",
              childProjectIdentifier: "Parsley",
              childProjectId: "parsley",
              variantsTasks: [
                {
                  name: "ubuntu2204-large",
                  tasks: ["e2e_test"],
                },
              ],
            },
          ]}
          selectedAliases={{ parsley: true }}
          totalSelectedTaskCount={0}
          aliasCount={1}
          childPatches={[]}
          activated={false}
          setSelectedAliases={setSelectedAliases}
        />,
      );
      expect(screen.getByLabelText("compile")).toBeInTheDocument();
      expect(screen.getByLabelText("test")).toBeInTheDocument();
      expect(screen.getByLabelText("parsley")).toBeInTheDocument();
    });
    it("selecting the entire alias calls setSelectedAliases with the correct arguments", async () => {
      const user = userEvent.setup();
      const selectedBuildVariants = ["parsley"];
      const setSelectedBuildVariantTasks = jest.fn();
      const setSelectedAliases = jest.fn();
      render(
        <ConfigureTasks
          selectedBuildVariants={selectedBuildVariants}
          selectedBuildVariantTasks={{
            ubuntu2004: { compile: false, test: false },
            ubuntu1804: { compile: false, lint: false },
          }}
          setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
          selectableAliases={[
            {
              alias: "parsley",
              childProjectIdentifier: "Parsley",
              childProjectId: "parsley",
              variantsTasks: [
                {
                  name: "ubuntu2204-large",
                  tasks: ["e2e_test"],
                },
              ],
            },
          ]}
          selectedAliases={{
            parsley: false,
          }}
          totalSelectedTaskCount={0}
          aliasCount={0}
          childPatches={[]}
          activated={false}
          setSelectedAliases={setSelectedAliases}
        />,
      );
      expect(screen.getByLabelText("Add alias to patch")).toBeInTheDocument();
      await user.click(screen.getByText("Add alias to patch"));
      expect(setSelectedAliases).toHaveBeenCalledWith({
        parsley: true,
      });
      expect(setSelectedBuildVariantTasks).toHaveBeenCalledWith({
        ubuntu2004: { compile: false, test: false },
        ubuntu1804: { compile: false, lint: false },
      });
    });
  });
});
