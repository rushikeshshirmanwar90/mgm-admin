import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
    searchQuery: string
    onSearchChange: (query: string) => void
}

export const SearchBar = ({ searchQuery, onSearchChange }: SearchBarProps) => {
    return (
        <div className="mb-6">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    placeholder="Search staff members..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>
        </div>
    )
}