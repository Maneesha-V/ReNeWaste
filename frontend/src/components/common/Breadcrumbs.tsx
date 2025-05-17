import { useNavigate } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  paths: BreadcrumbItem[];
}


interface BreadcrumbsProps {
  paths: BreadcrumbItem[];
  fullWidth?: boolean;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ paths, fullWidth }) => {
  const navigate = useNavigate();

  return (
    <nav className={`${fullWidth ? "w-full px-4 pt-4" : "w-full max-w-5xl mx-auto px-4 pt-4"}`}>
      <ol className="flex text-gray-600 text-sm flex-wrap">
        {paths.map((item, index) => (
          <li
            key={index}
            className={`flex items-center ${index === paths.length - 1 ? "text-green-600 font-bold" : ""}`}
          >
            {item.path ? (
              <button
                onClick={() => navigate(item.path!)}
                className="hover:underline"
              >
                {item.label}
              </button>
            ) : (
              <span>{item.label}</span>
            )}
            {index < paths.length - 1 && <span className="mx-1">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;