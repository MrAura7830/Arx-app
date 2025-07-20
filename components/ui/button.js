// Placeholder for ShadCN UI Button, replace with actual import after shadcn-ui init
export function Button({ children, ...props }) {
  return (
    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors" {...props}>
      {children}
    </button>
  );
}
