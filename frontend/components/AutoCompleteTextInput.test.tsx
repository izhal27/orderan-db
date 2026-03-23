import { act, fireEvent, render, screen } from "@testing-library/react";
import AutoCompleteTextInput from "./AutoCompleteTextInput";

jest.useFakeTimers();

const mockRequest = jest.fn();
jest.mock("@/lib/useApiClient", () => ({
  useApiClient: () => ({ request: mockRequest }),
}));

jest.mock("@/helpers", () => ({
  showToast: jest.fn(),
}));

type Item = { id: number; name: string };

describe("AutoCompleteTextInput", () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  it("fetches and shows suggestions after debounce", async () => {
    mockRequest.mockResolvedValue([{ id: 1, name: "GOONERS" }]);

    render(
      <AutoCompleteTextInput<Item>
        fetchUrl="/customers"
        getDisplayValue={(i) => i.name}
        getKeyValue={(i) => i.id}
        onSelect={() => {}}
      />,
    );

    const input = screen.getByPlaceholderText("Type to search...");
    fireEvent.change(input, { target: { value: "goo" } });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(mockRequest).toHaveBeenCalledWith("/customers?query=goo");
    expect(await screen.findByText("GOONERS")).toBeInTheDocument();
  });

  it("calls onSelect when suggestion clicked", async () => {
    mockRequest.mockResolvedValue([{ id: 1, name: "ARSENAL" }]);
    const onSelect = jest.fn();

    render(
      <AutoCompleteTextInput<Item>
        fetchUrl="/customers"
        getDisplayValue={(i) => i.name}
        getKeyValue={(i) => i.id}
        onSelect={onSelect}
      />,
    );

    const input = screen.getByPlaceholderText("Type to search...");
    fireEvent.change(input, { target: { value: "ars" } });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const item = await screen.findByText("ARSENAL");
    fireEvent.click(item);

    expect(onSelect).toHaveBeenCalledWith({ id: 1, name: "ARSENAL" });
  });
});
