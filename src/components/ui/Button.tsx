import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import { DEFAULT_COLOR } from "../../utils/default";
import { signInWithGoogle } from "../../utils/firebase";

interface ButtonInterface {
  className?: string;
  children: React.ReactNode;
  text_color?: string;
  bg_color?: string;
  method?: () => void;
}

interface LinkButtonInterface extends ButtonInterface {
  link: string;
}

export const Button: React.FC<ButtonInterface> = (props) => {
  const { className, children, text_color, bg_color, method } = props;
  return (
    <button
      className={cn(`px-6 py-3 ${bg_color || DEFAULT_COLOR.bg_color} ${text_color || DEFAULT_COLOR.text_color} rounded-md transition`, className)}
      onClick={method}
    >
      {children}
    </button>
  );
};

export const RoundedButton: React.FC<ButtonInterface> = (props) => {
  const { className, children, text_color, bg_color, method } = props;
  return (
    <button
      className={cn(
        `px-6 py-3 ${bg_color || DEFAULT_COLOR.bg_color} ${text_color || DEFAULT_COLOR.text_color} px-4 py-2 rounded-full shadow-lg transition`,
        className
      )}
      onClick={method}
    >
      {children}
    </button>
  );
};

export const LinkButton: React.FC<LinkButtonInterface> = (props) => {
  const { className, children, text_color, bg_color, link } = props;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return (
    <button
      className={cn(`px-6 py-3 ${bg_color || DEFAULT_COLOR.bg_color} ${text_color || DEFAULT_COLOR.text_color} rounded-md transition`, className)}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export const RoundedLinkButton: React.FC<LinkButtonInterface> = (props) => {
  const { className, children, text_color, bg_color, link } = props;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return (
    <button
      className={cn(`${bg_color || DEFAULT_COLOR.bg_color} ${text_color || DEFAULT_COLOR.text_color} px-4 py-2 rounded-full shadow-lg transition`, className)}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export const LoginButton: React.FC<ButtonInterface> = (props) => {
  const { className, children, text_color, bg_color } = props;
  const navigate = useNavigate();
  const handleLogin = async () => {
    await signInWithGoogle();
    return navigate("/");
  };
  return (
    <button
      className={cn(`px-6 py-3 ${bg_color || DEFAULT_COLOR.bg_color} ${text_color || DEFAULT_COLOR.text_color} rounded-md transition`, className)}
      onClick={() => {
        handleLogin();
      }}
    >
      {children}
    </button>
  );
};
