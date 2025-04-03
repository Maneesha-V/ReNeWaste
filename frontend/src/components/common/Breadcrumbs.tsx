import { useNavigate } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  paths: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ paths }) => {
  const navigate = useNavigate();

  return (
    <div className="py-3 px-6">
      <nav className="w-full max-w-2xl py-2">
        <ol className="flex text-gray-600 space-x-2 text-sm">
          {paths.map((item, index) => (
            <li key={index} className={index === paths.length - 1 ? "text-green-600 font-bold" : ""}>
              {item.path ? (
                <button onClick={() => item.path && navigate(item.path)} className="hover:underline">
                  {item.label}
                </button>
              ) : (
                <span>{item.label}</span>
              )}
              {index < paths.length - 1 && <span> / </span>}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumbs;
