/*
 * SessionTexTexi2Dvi.hpp
 *
 * Copyright (C) 2009-11 by RStudio, Inc.
 *
 * This program is licensed to you under the terms of version 3 of the
 * GNU Affero General Public License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * AGPL (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.
 *
 */

#ifndef SESSION_MODULES_TEX_TEXI2DVI_HPP
#define SESSION_MODULES_TEX_TEXI2DVI_HPP

#include <core/FilePath.hpp>

#include <core/system/Types.hpp>

#include "SessionTexPdfLatex.hpp"

namespace core {
   class Error;
   class FilePath;
}
 
namespace session {
namespace modules { 
namespace tex {
namespace texi2dvi {

core::Error texToPdf(const tex::pdflatex::PdfLatexOptions& options,
                     const core::FilePath& texFilePath);

} // namespace texi2dvi
} // namespace tex
} // namespace modules
} // namesapce session

#endif // SESSION_MODULES_TEX_TEXI2DVI_HPP
