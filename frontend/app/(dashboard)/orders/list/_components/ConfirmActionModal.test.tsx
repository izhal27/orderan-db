import { fireEvent, render, screen } from "@testing-library/react";
import ConfirmActionModal from "./ConfirmActionModal";

describe("ConfirmActionModal", () => {
  it("renders and calls confirm", () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();

    render(
      <ConfirmActionModal
        isOpen
        title="Konfirmasi"
        description="Aksi ini akan mengubah status."
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getAllByText("Konfirmasi")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Konfirmasi" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
