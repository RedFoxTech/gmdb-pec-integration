import { MaskProps } from "@/components/common/TextField";
import { IMask } from "react-imask";

const time: MaskProps = {
  mask: "HH:MM",
  blocks: {
    HH: {
      mask: IMask.MaskedRange,
      from: 0,
      to: 23,
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 0,
      to: 59,
    },
  },
};

const date: MaskProps = {
  mask: "dd/mm/yyyy",
  blocks: {
    dd: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 31,
      maxLength: 2,
    },
    mm: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
      maxLength: 2,
    },
    yyyy: {
      mask: IMask.MaskedRange,
      from: 1900,
      to: 9999,
    },
  },
};

const phone = {
  mask: "(00) 0000-00000",
  definitions: {
    "#": /[1-9]/,
  },
};

const cpf = {
  mask: "000.000.000-00",
};

const values = {
  time,
  date,
  phone,
  cpf,
};

export default values;

export const removePhoneMask = (phone: string) => {
  return phone.replace(/\D/g, "");
};

export const removeCpfMask = (cpf: string) => {
  return cpf.replace(/\D/g, "");
};

export const cpfMask = (value?: string) => {
  if (!value) return null;

  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const phoneMask = (value?: string) => {
  if (!value) return null;

  value = value.replace(/\D/g, "");

  if (value.length <= 10) {
    return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else {
    return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
};

export const zipcodeMask = (value?: string) => {
  if (!value) return null;

  value = value.replace(/\D/g, "");

  return value.replace(/(\d{5})(\d{0,3})/, "$1-$2");
};
