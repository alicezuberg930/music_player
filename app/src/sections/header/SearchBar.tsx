import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Search, X } from 'lucide-react'

const SearchBar = () => {
    const navigate = useNavigate()
    const [keyword, setKeyword] = useState<string>('')

    const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter' && e.currentTarget.value.length > 2) {
            navigate({
                pathname: 'search/all',
                search: '?q=' + e.currentTarget.value
            })
        }
    }

    return (
        <div className='max-w-[440px] w-full'>
            <div className='bg-[#ffffff54] text-gray-500 rounded-3xl py-2'>
                <div className='flex w-full'>
                    <div className='pl-4 self-center'>
                        <Search />
                    </div>
                    <input
                        type='text' className='outline-none px-4 w-full bg-transparent'
                        placeholder='Tìm kiếm bài hát, nghệ sĩ, lời bài hát'
                        onKeyUp={(e) => handleSubmit(e)}
                        onChange={(e) => { setKeyword(e.target.value) }} value={keyword}
                    />
                    <div className={`${keyword ? 'block' : 'hidden'} self-center pr-4`} onClick={() => setKeyword('')}>
                        <X />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchBar