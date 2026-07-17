import { useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

export default function useConfirm() {
  const [options, setOptions] = useState(null);

  function confirm({
    title = "Potvrzení",
    message = "Opravdu chcete pokračovat?",
    confirmText = "Ano",
    cancelText = "Ne",
  }) {
    return new Promise((resolve) => {
      setOptions({
        title,
        message,
        confirmText,
        cancelText,
        resolve,
      });
    });
  }

  const dialog = (
    <ConfirmDialog
      open={!!options}
      title={options?.title}
      message={options?.message}
      confirmText={options?.confirmText}
      cancelText={options?.cancelText}
      onCancel={() => {
        options?.resolve(false);
        setOptions(null);
      }}
      onConfirm={() => {
        options?.resolve(true);
        setOptions(null);
      }}
    />
  );

  return { confirm, dialog };
}