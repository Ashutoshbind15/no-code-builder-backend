export function CustomAlert({ message, type }) {
    return (
  <div className="alert alert-info p-4 rounded bg-blue-100 text-blue-800">
{message}
  </div>
    );
}