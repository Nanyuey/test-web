import XLSX from 'xlsx'

/**
 * 二维数组导出excel
 * @param { string[][] } data - table数据二维数组
 * @param { Object } options - 配置项
 * @param { string } options.sheetName - sheet名字
 * @param { string } options.fileName - 文件名字
 * @param { {s: {c: number, r: number}, e: {c: number, r: number}} } options.merges - 合并单元格
 * @param { number[] } options.wch - 单元格宽
 * @param { number[] } options.hpx - 单元格高
 * // merges: {
 *   s: {//s为开始
 *       c: 1,//开始列
 *       r: 0//可以看成开始行,实际是取值范围
 *   },
 *   e: {//e结束
 *       c: 4,//结束列
 *       r: 0//结束行
 *   }
 * }
 */
export function exportByArray (data, options) {
  const sheet = XLSX.utils.aoa_to_sheet(data)
  sheet['!merges'] = options.merges
  sheet['!cols'] = options.wch
    ? options.wch.map(item => ({ wch: item || 50 }))
    : []
  sheet['!rows'] = options.hpx
    ? options.hpx.map(item => ({ hpx: item || 20 }))
    : []
  const workbook = XLSX.utils.book_new()
  // 确保 sheetName、fileName 为string,否则会报错
  // sheetName 限制 31字符，是exxel本身的限制
  try {
    XLSX.utils.book_append_sheet(workbook, sheet, `${options.sheetName}`.substr(0, 25))
    XLSX.writeFile(workbook, `${options.fileName}.xlsx`)
  } catch (error) {
    console.log(error)
  }
}
