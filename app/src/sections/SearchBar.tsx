import { useNavigate } from 'react-router-dom'
import { icons } from '@/lib/icons'
import { useState } from 'react'

const SearchBar = () => {
    const { GrClose, FiSearch } = icons
    const navigate = useNavigate()
    const [keyword, setKeyword] = useState('')

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
            <div className='bg-[hsla(0,0%,100%,0.1)] text-gray-500 rounded-3xl flex items-center'>
                <div className='flex w-full'>
                    <span className='pl-4 self-center'>
                        <FiSearch size={24} />
                    </span>
                    <input type='text' className='py-2 outline-none px-4 w-full bg-transparent'
                        placeholder='Tìm kiếm bài hát, nghệ sĩ, lời bài hát' onKeyUp={(e) => handleSubmit(e)}
                        onChange={(e) => { setKeyword(e.target.value) }}
                        value={keyword}
                    />
                    <span className={`${keyword ? 'block' : 'hidden'} self-center pr-4`} onClick={() => setKeyword('')}>
                        <GrClose />
                    </span>
                </div>
            </div>
        </div>
    )
}

export default SearchBar