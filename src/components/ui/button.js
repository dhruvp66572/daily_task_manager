export function Button({ children, onClick, variant = "default" }) {
    const base = "px-4 py-2 rounded text-white font-semibold cursor-pointer";
    const styles = {
      default: "bg-blue-500 hover:bg-blue-600",
      destructive: "bg-red-500 hover:bg-red-600",
    };
    return <button onClick={onClick} className={`${base} ${styles[variant]}`}>{children}</button>;
  }
  