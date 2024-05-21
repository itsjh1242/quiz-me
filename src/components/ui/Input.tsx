import { cn } from "../../utils/cn";

const INPUT_DEFAULT_SETTING = {
  label: "label",
  type: "text",
  placeholder: "입력하세요",
  focus_color: "ring-blue-500",
};

interface InputInterface {
  className?: string;
  prop_ref?: React.RefObject<HTMLInputElement>;
  label?: string;
  type?: string;
  placeholder?: string;
  focus_color?: string;
  method?: ((event: React.ChangeEvent<HTMLInputElement>, target: string) => void) | (() => {});
  AddQuizContextTarget: string;
}

export const Input = (props: InputInterface) => {
  const { className, prop_ref, label, type, placeholder, focus_color, method, AddQuizContextTarget } = props;

  return (
    <>
      <label className="block text-gray-700 mb-2">{label === undefined ? INPUT_DEFAULT_SETTING.label : label}</label>
      <input
        ref={prop_ref === undefined ? null : prop_ref}
        type={type === undefined ? INPUT_DEFAULT_SETTING.label : type}
        className={cn(
          `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:${
            focus_color === undefined ? INPUT_DEFAULT_SETTING.focus_color : focus_color
          }`,
          className
        )}
        placeholder={placeholder === undefined ? INPUT_DEFAULT_SETTING.placeholder : placeholder}
        onChange={(event) => {
          if (method) {
            method(event, AddQuizContextTarget);
          }
        }}
      />
    </>
  );
};
